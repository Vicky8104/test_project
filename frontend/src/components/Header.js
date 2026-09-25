import { useEffect, useState } from "react";
// import { FaBars } from "react-icons/fa";
import Navbar from "./Navbar";
import priyankajodhawat from "../assests/priyankajodhawat.jpeg";

import "./Header.css";
const members = [
  {
   
    img: priyankajodhawat,
    name: "प्रियंका जोधावत",
    post: "आयुक्त",
  },
  {
    img: "https://i.pravatar.cc/300?img=2",
    name: "डाॅ. भास्कर शर्मा",
    post: "संयुक्त निदेशक",
  },
  {
    img: "https://i.pravatar.cc/300?img=4",
    name: "डाॅ. महेन्द्र कुमार शर्मा",
    post: "उपनिदेशक",
  },
];


export default function Header({ toggleSidebar }) {
  const [index, setIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % members.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (

    <header className="header">

      <div className="header-top">
        {/* LEFT */}
        <div className="logo">
          <img src="/imageslogo-removebg-preview.png" alt="Person" />
          {/* <div className="info">
            <h4>{members[index].name}</h4>
            <p>{members[index].post}</p>
          </div> */}
        </div>


        <div className="center">

          <div className="center-top">
            <h1 className="depName">संस्कृत-शिक्षा-विभाग-राजस्थानम्</h1>
          </div>

          {/* 🔥 NAVBAR (IMPORTANT) */}
          <div className="center-bottom">
            <h2>पदस्थापन-परामर्श-पोर्टलम्</h2>
          </div>
        </div>




        {/* RIGHT */}
        {/* <div className="right">
          <h2>पदस्थापन-परामर्श-पोर्टलम्</h2>
        </div> */}

          <div className="left">
          {/* <img src={members[index].img} alt="Person" /> */}
          <div className="info">
            <h4>{members[index].name}</h4>
            <p>{members[index].post}</p>
          </div>
        </div>

      </div>


      <div className="navbar-container">
       <div className="nav-with-icon">
         {/* <FaBars className="menu-icon" onClick={toggleSidebar} />  */}
               <Navbar />
        </div>

          <div className="marquee">
            <div className="marquee-container1">
              <div className="marquee-text">
                📢 वरिष्ठ अध्यापक (विभिन्न विषय) अधिशेष कार्मिक पदस्थापन काउंसलिग आवेदन की अन्तिम तिथि 30.09.2026 सांय 06ः00 बजे है.
              </div>
            </div>
          </div>
    </div>


    </header>



  );
}
