import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NavMenu } from "@/components/Navbar/NavMenu";

export default function MobileMenu() {
  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button variant='ghost' size='sm'>
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-screen top-0 left-0 right-auto mt-0 w-full md:w-[400px] md:rounded-r-lg rounded-none'>
        <DrawerClose className='absolute right-0 top-0 mr-4 mt-4'>
          <X />
        </DrawerClose>

        <NavMenu className='my-auto space-y-4 flex flex-col mx-auto text-center text-3xl' />
      </DrawerContent>
    </Drawer>
  );
}
