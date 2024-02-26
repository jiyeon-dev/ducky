import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CategoryButtons() {
  return (
    <div className='text-right'>
      <Link to='/posts/new'>
        <Button variant='secondary' size='sm'>
          글쓰기
        </Button>
      </Link>
    </div>
  );
}
