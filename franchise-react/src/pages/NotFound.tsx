import Plane from "@/assets/PlaneNotFound.png";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center w-full h-screen px-4 ">
      <img src={Plane} alt="Plane" />
      <div className="mx-auto mb-8 font-bold text-blue">
        <p className="text-[80px]">404</p>
        <p className="text-2xl">Page Not Found</p>
      </div>
      <div className="px-6 text-justify">
        <p className="text-sm font-medium">
          Pro Tip :{" "}
          <span className="text-sm font-normal">
            Just like every shipment needs the right address, make sure the URL you entered is correct!
          </span>
        </p>
        <p className="text-sm font-normal">
          If you continue to have trouble, please reach out to our support team, and we'll help you find your way.
        </p>
      </div>
    </div>
  );
}
