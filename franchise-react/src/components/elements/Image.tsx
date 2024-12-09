import LogoPNG from "/logo.png";
import illustration from "/illustration.jpg";

export const Image = () => {
  return (
    <div className="mt-4 lg:mt-16">
      <img src={illustration} />
    </div>
  );
};

export const Logo = () => {
  return (
    <div className="flex justify-center py-4 align-middle md:mr-auto">
      <img src={LogoPNG} className="h-12" />
    </div>
  );
};
