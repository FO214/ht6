import cv2

def main():
    cap = cv2.VideoCapture(1)

    if not cap.isOpened():
        print("Error: Could not open webcam")
        return

    while True:
        ret, frame = cap.read()

        if not ret:
            print("Error: Could not read frame")
            break

        cv2.imshow('Webcam Feed', frame)

        key = cv2.waitKey(1)

        if key & 0xFF == ord('q'):
            break
        elif key & 0xFF == ord('s'):
            cv2.imwrite('snapshot.png', frame)
            print("Snapshot saved as snapshot.png")

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()