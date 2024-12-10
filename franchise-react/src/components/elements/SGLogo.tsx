import Logo from "/logo.png";

export default function SGLogo() {
  return (
    <div className="flex items-start justify-center m-4 mb-0 lg:my-8 lg:mx-20 md:justify-start ">
      <img src={Logo} className="h-12" alt="Shipglobal" />
    </div>
  );
}
