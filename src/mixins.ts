import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { watch } from "vue";
import { useRoute } from "vue-router";

const refreshOnRouteChange = (
  initialize: (id: string, userID?: string) => void
) => {
  const route = useRoute();

  watch(route, async (_, newRoute) => {
    const id = newRoute.params.id as string;
    const userID = newRoute.params.userID as string;
    if (id && userID) initialize(id, userID);
    else if (id) initialize(id);
  });
};

const convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

const readAsBase64 = async (photo: Photo) => {
  const response = await fetch(photo.webPath as string);
  const blob = await response.blob();
  const base64 = (await convertBlobToBase64(blob)) as string;
  return base64.replace("data:image/png;base64,", "");
};

const saveImage = async (photo: Photo) => {
  const base64Data = await readAsBase64(photo);
  const fileName = new Date().getTime() + ".jpeg";
  await Filesystem.writeFile({
    path: `job-itinerary/${fileName}`,
    data: base64Data,
    directory: Directory.Data,
  });
};

const takePhoto = async () => {
  const image = await Camera.getPhoto({
    quality: 100,
    source: CameraSource.Prompt, // Photos OR Camera
    resultType: CameraResultType.Base64,
    saveToGallery: true,
  });

  return image;
};

export { refreshOnRouteChange, takePhoto, saveImage, readAsBase64 };
