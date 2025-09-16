import { FaRegCalendarCheck } from "react-icons/fa";
export const description =
  "A simple login form with email and password. The submit button says 'Sign in'.";

export function AppLogo() {
  return (
    <div className="flex gap-2 items-center mb-8 mt-5 justify-center   ">
      <div className="bg-primary p-2 text-white rounded-sm text-lg ">
        < FaRegCalendarCheck/>
      </div>

      <div className="font-bold  text-2xl flex gap-1 justify-center items-center">
        <span className="text-primary"> Smart</span>
        <span>Task</span>
      </div>
    </div>
  );
}