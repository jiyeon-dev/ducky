import { AVATAR_LIST } from "@/constant/avatar";
import { toast } from "sonner";

interface Image {
  id: string;
  url: string;
}
interface AvatarSelectProps {
  errors?: Record<string, string[] | undefined>;
}

export default function AvatarSelect({ errors }: AvatarSelectProps) {
  // 에러 표시
  if (errors && errors.avatar) {
    toast.error(errors.avatar[0], { id: "avatar-error" });
  }

  const handlerClick = (e: React.MouseEvent) => {
    const current = e.target as HTMLImageElement;

    // toggle `selected`
    let nextSibling = current.parentNode?.firstElementChild;
    while (nextSibling) {
      if (nextSibling.tagName === "IMG") {
        if (nextSibling.id === current.id) {
          // select
          nextSibling.classList.add("bg-yellow-400");
          nextSibling.classList.add("border-yellow-400");
        } else {
          // remove
          nextSibling.classList.remove("bg-yellow-400");
          nextSibling.classList.remove("border-yellow-400");
        }
      } else if (nextSibling.tagName === "INPUT") {
        // input hidden 인 경우 선택한 이미지 경로 입력
        (nextSibling as HTMLInputElement).value = current.id;
      }

      nextSibling = nextSibling.nextElementSibling;
    }
  };

  return (
    <div className='flex space-x-2 justify-center'>
      {AVATAR_LIST.map((img: Image) => (
        <Avatar image={img} key={img.id} onClick={handlerClick} />
      ))}
      <input type='hidden' name='avatar' />
    </div>
  );
}

const Avatar = ({
  image,
  onClick,
}: {
  image: Image;
  onClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <img
      id={image.id}
      src={image.url}
      width='60px'
      height='60px'
      alt={image.id}
      className='rounded-full scale-110	border cursor-pointer hover:border-gray-500'
      onClick={onClick}
    />
  );
};
