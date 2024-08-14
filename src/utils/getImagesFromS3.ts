
import { Restaurant, TimeDiscount } from 'src/types/interfaces';


const getImagesFromS3 = ({
  restaurantDetails ,
   menuImgsName  , setMenuImgs , uploadedImages , imagesData , setImagesData
} : {
  restaurantDetails : Restaurant,
  menuImgsName  : string[] ,
  setMenuImgs  : React.Dispatch<React.SetStateAction<string[] >>,
   uploadedImages  : string[], 
   imagesData  : string[], 
   setImagesData : React.Dispatch<React.SetStateAction<string[] >>
}) => {


    let menuImg: string[] = [];
    menuImgsName.forEach(async (m) => {
      const data = `https://d3eiw2rs38fo3w.cloudfront.net/public/${m}`;
      menuImg.push(data.toString());
      setMenuImgs([...menuImg]);
    });


    let newImgLen;
    if (restaurantDetails!.mainImageUrl) {
      newImgLen = [
        restaurantDetails!.mainImageUrl,
        ...restaurantDetails!.images,
        ...uploadedImages
      ].length;
    } else {

      newImgLen = [...uploadedImages].length;
    }
    if (newImgLen === imagesData.length) {

      return;
    }
    const imgs = [
      restaurantDetails!.mainImageUrl,
      ...restaurantDetails!.images,];
    // if (uploadedImages.length) {
    //   setLoading(true);
    // }
    let img1: string[] = [];
    imgs.forEach((i) => {
      if (i) {
        img1.push(i);
      }
    })
    setImagesData(img1);
    let upImg: string[] = [];
    uploadedImages.forEach(async (img) => {
      const data = `https://d3eiw2rs38fo3w.cloudfront.net/public/${img}`;

      // console.log([...imagesData, data.toString()]);
      upImg.push(data.toString());
      setImagesData([
        ...img1,
        ...upImg,
      ])
      length = [
        ...img1,
        ...upImg,
      ].length
    })
    // console.log(imagesData);

  }
  export default getImagesFromS3