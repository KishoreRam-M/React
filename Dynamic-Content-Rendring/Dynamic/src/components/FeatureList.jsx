import React from "react";
import FeatureItem from "./FeatureItem";


const features = [
    { title: "Processor", description: "Intel Core i7 12th Gen / Ryzen 7 6800H" },
    { title: "GPU", description: "NVIDIA RTX 3060 / 4050 / 4070 (6GB-8GB VRAM)" },
    { title: "RAM", description: "16GB DDR5 4800MHz (Expandable to 32GB)" },
    { title: "Storage", description: "512GB / 1TB NVMe SSD (Upgradeable)" },
    { title: "Display", description: "15.6-inch FHD 144Hz / 165Hz Adaptive-Sync" },
    { title: "Keyboard", description: "RGB Backlit Keyboard (One-Zone)" },
    { title: "Battery", description: "90WHrs Battery (Fast Charging)" },
    { title: "Cooling", description: "Dual Fan, 4 Exhaust Vents, Arc Flow Fans" }
  ];



  const FeatureList = () => {
    return `(
      <div>
        {features.map((feature, index) => (
          <FeatureItem key={index} title={feature.title} description={feature.description} />
        ))}
      </div>
    );
  };


  export default FeatureList;
