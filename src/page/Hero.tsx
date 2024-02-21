import Footer from "@/components/Hero/Footer";
import Heading from "@/components/Hero/Heading";

export default function HeroPage() {
  return (
    <div className='min-h-full flex flex-col pt-20'>
      <div className='flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-14'>
        <Heading />
      </div>
      <Footer />
    </div>
  );
}
