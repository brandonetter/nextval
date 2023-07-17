import React, { useState, useEffect, ChangeEvent } from "react";

interface FormState {
  [key: string]: string;
}
interface FormResults {
  success: boolean;
  values: {
    [key: string]: string;
  };
}
interface ValidateConfig {
  [key: string]: {
    validate: (value: string) => boolean;
    message: string;
    successClass?: string;
    errorClass?: string;
  };
}

interface RegisterResult {
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  value: string;
  className: string;
  onBlur: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

interface UseFormResult {
  register: (name: string) => RegisterResult;
  formState: FormResults;
  validate: ValidateConfig;
  errors: FormState;
  errorClass?: FormState;
  successClass?: FormState;
  slowErrors?: FormState;
}

export const useForm = (): UseFormResult => {
  const [formState, setFormState] = useState<FormResults>({
    success: false,
    values: {},
  });
  const [formPrevalidate, setFormPrevalidate] = useState<FormState>({});
  const validate: ValidateConfig = {};
  const [errors, setErrors] = useState<FormState>({});
  const [success, setSuccess] = useState<FormState>({});
  const [successClass, setSuccessClassState] = useState<FormState>({});
  const [successClassPreBlur, setSuccessClassStatePreBlur] =
    useState<FormState>({});

  const [errorClass, setErrorClassState] = useState<FormState>({});
  const [errorClassPreBlur, setErrorClassStatePreBlur] = useState<FormState>(
    {}
  );
  const [slowErrors, setSlowErrors] = useState<FormState>({});
  const [constClass, setConstClassState] = useState<FormState>({});

  useEffect(() => {
    let preFalse: boolean | undefined = undefined;
    Object.keys(validate).forEach((key) => {
      if (!formPrevalidate[key]) {
        formPrevalidate[key] = "";
        setErrors((prevState) => ({
          ...prevState,
          [key]: validate[key].message,
        }));
        preFalse = false;
      }
    });
    Object.keys(formPrevalidate).forEach((key) => {
      const value = formPrevalidate[key];
      if (validate[key]) {
        const validateResult = validate[key].validate(value);
        if (validateResult) {
          successClassPreBlur[key] = validate[key].successClass || "";
          if (constClass[key]) {
            successClass[key] = validate[key].successClass || "";
          }
          setSuccess((prevState) => ({
            ...prevState,
            [key]: "true",
          }));
          setErrors((prevState) => {
            const newState = { ...prevState };
            delete newState[key];
            return newState;
          });
          setErrorClassState((prevState) => {
            const newState = { ...prevState };
            delete newState[key];
            return newState;
          });
          setErrorClassStatePreBlur((prevState) => {
            const newState = { ...prevState };
            delete newState[key];
            return newState;
          });
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [key]: validate[key].message,
          }));
          errorClassPreBlur[key] = validate[key].errorClass || "";
          if (constClass[key]) {
            errorClass[key] = validate[key].errorClass || "";
          }
        }
      }
    });
    setFormState((prevState) => ({
      ...prevState,
      //   success: preFalse || Object.keys(errors).length === 0,
      values: {
        ...formPrevalidate,
      },
    }));
  }, [formPrevalidate]);
  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      success: Object.keys(errors).length === 0,
    }));
    setSlowErrors((prevState) => {
      let newState = { ...prevState };
      Object.keys(success).forEach((error) => {
        delete newState[error];
      });
      return newState;
    });
  }, [errors, success]);
  useEffect(() => {
    Object.keys(errors).forEach((error) => {
      if (constClass[error]) {
        console.log("set slow error", errors[error]);
        setSlowErrors((prevState) => ({
          ...prevState,
          [error]: errors[error],
        }));
      }
    });
  }, [errors, constClass]);

  const setSuccessClass = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = event.target.name;
    if (success[name]) {
      setConstClassState((prevState) => ({
        ...prevState,
        [name]: "true",
      }));
      setSuccessClassState((prevState) => ({
        ...prevState,
        [name]: successClassPreBlur[name],
      }));
    }
  };
  const setErrorClass = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = event.target.name;
    if (errors[name]) {
      setConstClassState((prevState) => ({
        ...prevState,
        [name]: "true",
      }));
      setErrorClassState((prevState) => ({
        ...prevState,
        [name]: errorClassPreBlur[name],
      }));
    }
  };

  const updateClassState = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrorClass(event);
    setSuccessClass(event);
  };

  const register = (name: string): RegisterResult => {
    const handleChange = (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const value = event.target.value;
      setFormPrevalidate((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    return {
      name,
      onChange: handleChange,
      value: formState.values[name] || "",
      className: errorClass[name] || successClass[name] || "",
      onBlur: updateClassState,
    };
  };

  return {
    register,
    formState,
    validate,
    errors,
    slowErrors,
  };
};
