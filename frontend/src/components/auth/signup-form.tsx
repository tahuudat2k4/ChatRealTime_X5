import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {z} from "zod";
import {useForm}  from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuthStore} from "@/stores/useAuthStore";
import { useNavigate } from "react-router"

// Define the schema for sign-up form validation (currently empty)
const signUpSchema = z.object({
     firstname: z.string().min(1, "Tên bắt buộc phải nhập"),
     lastname: z.string().min(1, "Họ bắt buộc phải nhập"),
     username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
     email: z.email("Địa chỉ email không hợp lệ"),
     password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
});
//  Infer the form values type from the schema
type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signUp} = useAuthStore();
  const navigate = useNavigate();
  // Initialize the form with react-hook-form and zod resolver
  const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema)
  }); 
  const onSubmit =  async (data: SignUpFormValues) =>{
    const {firstname, lastname, username, email, password} = data;
    // Call backend for sign-up logic
    await signUp(firstname, lastname, username, email, password);
    // Navigate to sign-in page after successful sign-up
      navigate("/signin");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img className="m-auto w-1/7 h-1/7" src="/logo.png" alt="logo" />
                </a>
                <h2 className="text-2xl font-bold">Tạo tài khoản X5</h2>
                <p className="text-muted-foreground text-balance">
                  Chào bạn, hãy đăng ký để bắt đầu sử dụng dịch vụ của chúng tôi!
                </p>
              </div>
              {/* first name / last name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="ml-3 block -text-sm">
                    Họ
                  </Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Vd: Nguyễn Văn"
                    {...register("lastname")}/>
                  {/* display error message if not valid */}
                  {errors.lastname && ( 
                    <p className="text-sm text-destructive ml-3">{errors.lastname.message}</p>
                  ) }
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="ml-3 block -text-sm">
                    Tên
                  </Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="Vd: Mười"
                    {...register("firstname")}/>
                  {/* display error message if not valid */}
                  {errors.firstname && ( 
                    <p className="text-sm text-destructive ml-3">{errors.firstname.message}</p>
                  ) }
                </div>
              </div>
              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="ml-3 block -text-sm">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Vd: tdprocode163"
                  {...register("username")}/>
                  {/* display error message if not valid */}
                  {errors.username && ( 
                    <p className="text-sm text-destructive ml-3">{errors.username.message}</p>
                  ) }
              </div>
              {/* email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="ml-3 block -text-sm">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Vd: tdprocode163@gmail.com"
                  {...register("email")}/>
                  {/* display error message if not valid */}
                  {errors.email && ( 
                    <p className="text-sm text-destructive ml-3">{errors.email.message}</p>
                  ) }
              </div>
              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="ml-3 block -text-sm">
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu của bạn"
                  {...register("password")}/>
                  {/* display error message if not valid */}
                  {errors.password && ( 
                    <p className="text-sm text-destructive ml-3">{errors.password.message}</p>
                  ) }
              </div>
              {/* button for signup */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}>
                Tạo tài khoản
              </Button>
              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <a href="/signin" className="text-primary underline underline-offset-4 ">
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/giphy.gif"
              alt="Image"
              className=" absolute w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground
       *:[a]:underline *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}
