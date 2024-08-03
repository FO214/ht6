import cv2

def get_camera_image():
    cap = cv2.VideoCapture(1)

    if not cap.isOpened():
        print("Error: Could not open webcam")
        return

    ret, frame = cap.read()

    if not ret:
        print("Error: Could not read frame")
        return

    cv2.imwrite('snapshot.png', frame)

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    get_camera_image()