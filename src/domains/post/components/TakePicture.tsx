import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, StatusBar } from "react-native";
import { CameraView, CameraType, FlashMode, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { CreatePostParams, CreatePostSteps } from "~/app/(tabs)/create-post";
import { FunnelSetState } from "@/components/utils/funnel/model";

interface TakePictureProps {
  setState: FunnelSetState<CreatePostSteps, CreatePostParams>;
  onClose?: () => void;
}

export function TakePicture({ onClose, setState }: TakePictureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const handlePermissionRequest = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert("카메라 권한 필요", "사진을 촬영하려면 카메라 권한이 필요합니다.", [
        { text: "취소", style: "cancel" },
        { text: "설정으로 이동", onPress: () => {} },
      ]);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        setState(prev => ({ ...prev, images: [...(prev.images || []), photo.uri] }));
      }
    } catch (error) {
      console.error("사진 촬영 실패:", error);
      Alert.alert("오류", "사진 촬영에 실패했습니다.");
    } finally {
      setIsCapturing(false);
    }
  };

  const openAlbum = async () => {
    if (!mediaPermission) {
      return;
    }

    if (mediaPermission.status !== ImagePicker.PermissionStatus.GRANTED) {
      const { status } = await requestMediaPermission();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert("앨범 접근 권한 필요", "사진을 선택하려면 앨범 접근 권한이 필요합니다.", [
          { text: "취소", style: "cancel" },
          { text: "설정으로 이동", onPress: () => {} },
        ]);
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      setState(prev => ({
        ...prev,
        images: [...(prev.images || []), ...result.assets.map(asset => asset.uri)],
        step: "form",
      }));
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === "back" ? "front" : "back"));
  };

  const toggleFlashMode = () => {
    setFlashMode(current => {
      switch (current) {
        case "off":
          return "on";
        case "on":
          return "auto";
        case "auto":
          return "off";
        default:
          return "off";
      }
    });
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case "on":
        return "flash";
      case "auto":
        return "flash-outline";
      case "off":
      default:
        return "flash-off";
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>카메라 권한을 확인하는 중...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#666" />
          <Text style={styles.permissionTitle}>카메라 권한이 필요합니다</Text>
          <Text style={styles.permissionMessage}>사진을 촬영하려면 카메라 접근 권한을 허용해주세요.</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handlePermissionRequest}>
            <Text style={styles.permissionButtonText}>권한 허용</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={cameraType} flash={flashMode} mode="picture">
        {/* 상단 컨트롤 */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleFlashMode}>
            <Ionicons name={getFlashIcon()} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 하단 컨트롤 */}
        <View style={styles.bottomControls}>
          <View style={styles.controlsRow}>
            {/* 앨범 선택 버튼 */}
            <View style={styles.sideControl}>
              <TouchableOpacity style={styles.controlButton} onPress={openAlbum}>
                <Ionicons name="images-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* 촬영 버튼 */}
            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            {/* 카메라 전환 버튼 */}
            <View style={styles.sideControl}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    position: "fixed",
    top: 0,
    left: 0,
    flex: 1,
    height: "100%",
    width: "100%",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
  },
  permissionMessage: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sideControl: {
    width: 60,
    alignItems: "center",
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
});
