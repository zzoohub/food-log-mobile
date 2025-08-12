import React from 'react';
import { CameraView } from '@/domains/camera';
import type { CapturedPhoto } from '@/types';

export default function CameraHomePage() {
  const handlePhotoCapture = (photos: CapturedPhoto[]) => {
    // Handle captured photos for fullscreen camera mode
    console.log('Photos captured:', photos.length);
    // In a real app, you would save these to the user's timeline
    // and possibly trigger AI analysis
  };

  return (
    <CameraView 
      mode="fullscreen" 
      onPhotoCapture={handlePhotoCapture}
    />
  );
}

