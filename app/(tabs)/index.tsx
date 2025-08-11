import { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  StatusBar, 
  SafeAreaView,
  useColorScheme 
} from "react-native";
import { CameraView, CameraType, FlashMode, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCameraI18n } from "@/lib/i18n";

export default function CameraHomePage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [isCapturing, setIsCapturing] = useState(false);
  // const [recentPhotos, setRecentPhotos] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const camera = useCameraI18n();

  useEffect(() => {
    StatusBar.setBarStyle("light-content", true);
  }, []);

  const handlePermissionRequest = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        camera.permissions.title, 
        camera.permissions.message,
        [
          { text: camera.permissions.cancel, style: "cancel" },
          { text: camera.permissions.openSettings, onPress: () => {} },
        ]
      );
    }
  };

  const quickCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      
      // Haptic feedback would go here in a real app
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        // Add to recent photos for quick preview
        // setRecentPhotos(prev => [photo.uri, ...prev.slice(0, 2)]);
        
        // Auto-save and process with AI (simulated)
        setTimeout(() => {
          Alert.alert(
            camera.capture.success, 
            camera.capture.successMessage,
            [{ text: camera.capture.viewTimeline, onPress: () => router.push("/timeline" as any) }]
          );
        }, 500);
      }
    } catch (error) {
      console.error("Photo capture failed:", error);
      Alert.alert(camera.capture.error, camera.capture.errorMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleFlash = () => {
    setFlashMode(current => {
      switch (current) {
        case "off": return "on";
        case "on": return "auto";
        case "auto": return "off";
        default: return "off";
      }
    });
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case "on": return "flash";
      case "auto": return "flash-outline";
      case "off":
      default: return "flash-off";
    }
  };

  // Permission states
  if (!permission) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {camera.preparing}
        </Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.permissionContainer, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
        <View style={styles.permissionContent}>
          <Ionicons name="camera-outline" size={80} color="#FF6B35" />
          <Text style={[styles.permissionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {camera.welcome.title}
          </Text>
          <Text style={[styles.permissionMessage, { color: isDark ? '#CCCCCC' : '#666666' }]}>
            {camera.welcome.message}
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handlePermissionRequest}>
            <Text style={styles.permissionButtonText}>{camera.welcome.enableCamera}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={cameraType} 
        flash={flashMode} 
        mode="picture"
      >
        {/* Top overlay with quick actions */}
        <View style={styles.topOverlay}>
          <TouchableOpacity 
            style={styles.topButton} 
            onPress={() => router.push("/timeline" as any)}
          >
            <Ionicons name="grid-outline" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.centerTop}>
            <Text style={styles.quickHint}>{camera.quickHint}</Text>
          </View>
          
          <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
            <Ionicons name={getFlashIcon()} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main capture area - the entire screen is tappable for speed */}
        <TouchableOpacity 
          style={styles.captureArea} 
          onPress={quickCapture}
          disabled={isCapturing}
          activeOpacity={0.8}
        >
          {/* Capture indicator */}
          <View style={styles.captureIndicator}>
            <View style={[styles.captureRing, isCapturing && styles.capturingRing]}>
              <View style={[styles.captureButton, isCapturing && styles.capturingButton]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Bottom overlay with secondary actions */}
        <View style={styles.bottomOverlay}>
          <TouchableOpacity 
            style={styles.bottomButton}
            onPress={() => router.push("/feeds")}
          >
            <Ionicons name="people-outline" size={20} color="white" />
            <Text style={styles.bottomButtonText}>{camera.discover}</Text>
          </TouchableOpacity>
          
          <View style={styles.bottomCenter}>
            {isCapturing ? (
              <Text style={styles.capturingText}>{camera.capturingText}</Text>
            ) : (
              <Text style={styles.hintText}>{camera.hintText}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.bottomButton}
            onPress={() => setCameraType(current => current === "back" ? "front" : "back")}
          >
            <Ionicons name="camera-reverse-outline" size={20} color="white" />
            <Text style={styles.bottomButtonText}>{camera.flip}</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  permissionButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  topOverlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  centerTop: {
    flex: 1,
    alignItems: "center",
  },
  quickHint: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  captureIndicator: {
    alignItems: "center",
    justifyContent: "center",
  },
  captureRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  capturingRing: {
    borderColor: "#FF6B35",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
  },
  capturingButton: {
    backgroundColor: "#FF6B35",
  },
  bottomOverlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  bottomButton: {
    alignItems: "center",
    padding: 8,
  },
  bottomButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomCenter: {
    flex: 1,
    alignItems: "center",
  },
  hintText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  capturingText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
