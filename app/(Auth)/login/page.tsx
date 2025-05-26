
import BlankLayout from "@/app/components/Layout/BlankLayout";
import LoginForm from "@/app/(Auth)/_components/LoginForm";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "User Login", description: "User Login" };

const Login = () => {
  return (
    <div className="flex min-h-screen">
      <div className="hidden min-h-screen w-1/2 flex-col  items-center  bg-[url(/assets/images/strongConcreteCover.jpg)] bg-no-repeat bg-cover p-4 bg-center text-white dark:text-black lg:flex" />
      <div className="relative flex w-full items-center justify-center lg:w-1/2">
        <div className="w-[500px] p-5 md:p-10">
          <Image
            height={130}
            width={130}
            src="/assets/images/logo.png"
            alt="coming_soon"
            className="mx-auto pb-5"
          />
          <h2 className="mb-3 text-3xl font-bold">Sign In</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

Login.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default Login;
