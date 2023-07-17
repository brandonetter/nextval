"use client";
import { useEffect } from "react";
import { useForm } from "@/util/validate";
export default function Home() {
  const { register, formState, validate, errors, slowErrors } = useForm();

  validate.firstName = {
    validate: (value) => {
      if (value.length < 4) return false;
      return true;
    },
    message: "First Name must be at least 4 characters",
    errorClass: "error",
    successClass: "success",
  };
  validate.lastName = {
    validate: (value) => {
      if (value.length < 4) return false;
      return true;
    },
    message: "Last Name must be at least 4 characters",
    errorClass: "error",
    successClass: "success",
  };
  validate.gender = {
    validate: (value) => {
      if (!value) return false;
      return true;
    },
    message: "Select a gender",
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formState);
  };
  useEffect(() => {
    console.log(formState);
  }, [formState]);
  return (
    <div className="w-1/3 mx-auto text-white mt-11 [&>form]:text-black">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col w-10/12 mx-auto gap-5 [&>div]:flex [&>div]:flex-col ">
          <div className="w-full">
            <label>First Name</label>
            <input {...register("firstName")} placeholder="First Name" />
          </div>
          <div>
            <label>Last Name</label>
            <input {...register("lastName")} placeholder="Last Name" />
          </div>
          <div className="">
            <label>Gender</label>
            <select {...register("gender")}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <input type="submit" />
        </div>
      </form>

      {/* {errors &&
        Object.keys(errors).map((error, id) => {
          return <p key={id}>{errors[error]}</p>;
        })} */}
      {slowErrors &&
        Object.keys(slowErrors).map((error, id) => {
          return <p key={id}>slow -{slowErrors[error]}</p>;
        })}
    </div>
  );
}
