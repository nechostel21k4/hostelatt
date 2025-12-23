import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DeveloperCardCss.css";
import { Galleria, GalleriaResponsiveOptions } from "primereact/galleria";

function DeveloperCard() {
  const Navigate = useNavigate();

  const [images, setImages] = useState<
    { itemImageSrc: string; thumbnailImageSrc: string; alt: string; title: string }[]
  >([]);

  const responsiveOptions: GalleriaResponsiveOptions[] = [
    {
      breakpoint: "991px",
      numVisible: 4,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];

  useEffect(() => {
    setImages([
      {
        itemImageSrc: "/images/developers/hostel-2.jpg",
        thumbnailImageSrc: "",
        alt: "Description for Image 1",
        title: "",
      },
      {
        itemImageSrc: "/images/developers/hostel-1.jpg",
        thumbnailImageSrc: "",
        alt: "Description for Image 1",
        title: "",
      },
      {
        itemImageSrc: "/images/developers/hostel-4.jpg",
        thumbnailImageSrc: "",
        alt: "Description for Image 1",
        title: "",
      },
      {
        itemImageSrc: "/images/developers/hostel-3.jpg",
        thumbnailImageSrc: "",
        alt: "Description for Image 1",
        title: "",
      },


      // Add more images as needed
    ]);
  }, []);

  const itemTemplate = (item: { itemImageSrc: string; alt: string }) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: "100%", display: "block" }} />;
  };

  const thumbnailTemplate = (item: { thumbnailImageSrc: string; alt: string }) => {
    return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: "block" }} />;
  };



  return (
    <>
      <Dialog
        header="About Developers"
        visible={true}
        onHide={() => {
          Navigate(-1);
        }}
        className="special-font w-10"
      >
        <div className="grid justify-content-center gap-4 mt-2">
          <div className="p-card p-shadow-6 profile-card col-10 md:col-5 ">
            <div className="text">
              <img src="/images/developers/21471A0521.png" alt="Profile" />
              <h3>Gangadhar Rongala</h3>
              <p className="role">Full Stack Web Developer</p>
              <p className="description special-font">
                21471A0521 (2021-2025)<br></br>
                Computer Science Engineering<br></br>
                Narasaraopeta Engineering College
              </p>
            </div>
            <div className="links">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/gangadhar-rongala-b65bb122a/"
              >
                <i className="pi pi-linkedin"></i>
              </a>
              <a target="_blank" href="" rel="noopener noreferrer">
                <i className="pi pi-github"></i>
              </a>
              <a target="_blank" href="" rel="noopener noreferrer">
                <i className="pi pi-facebook"></i>
              </a>
              <a target="_blank" href="" rel="noopener noreferrer">
                <i className="pi pi-instagram"></i>
              </a>
            </div>
          </div>

          <div className="p-card p-shadow-6 profile-card col-10 md:col-5 ">
            <div className="text">
              <img src="/images/developers/21471A05K4.png" alt="Profile" />
              <h3>Bhuvanesh Thotakura</h3>
              <p className="role">Full Stack Web Developer</p>
              <p className="description">
                21471A05K4 (2021-2025)<br></br>
                Computer Science Engineering<br></br>
                Narasaraopeta Engineering College
              </p>
            </div>
            <div className="links">
              <a
                target="_blank"
                href="https://www.linkedin.com/in/bhuvanesh-thotakura-079b37283/"
                rel="noopener noreferrer"
              >
                <i className="pi pi-linkedin"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer">
                <i className="pi pi-github"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer">
                <i className="pi pi-facebook"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer">
                <i className="pi pi-instagram"></i>
              </a>
            </div>
          </div>

          <div className="p-card mt-5">
            <Galleria value={images} responsiveOptions={responsiveOptions} numVisible={5} style={{ maxWidth: '640px' }}
              item={itemTemplate} showItemNavigators showItemNavigatorsOnHover showIndicators showThumbnails={false} circular autoPlay transitionInterval={2000} />
          </div>
        </div>




      </Dialog>
    </>
  );
}

export default DeveloperCard;
