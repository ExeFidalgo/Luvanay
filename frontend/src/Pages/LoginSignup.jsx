import React, { useState } from "react";
import './CSS/LoginSignUp.css'

const LoginSignup = () => {

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login = async () =>{
    console.log("Funcion Login Ejecutada", formData)
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:"POST",
      headers:{
        Accept: 'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)
  
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }

  const signup = async () =>{
    console.log("Funcion Sign Up Ejecutada", formData)
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:"POST",
      headers:{
        Accept: 'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)
  
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder="Tu nombre" />: <></>}
          <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Tu E-mail" />
          <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Contraseña" />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continuar</button>
        {state === "Sign Up"
        ?<p className="loginsingnup-login">Ya tienes cuenta? <span onClick={()=>{setState("Login")}}>Inicia sesión aquí</span></p>
      :<p className="loginsingnup-login">Crea tu cuenta! <span onClick={()=>{setState("Sign Up")} }>Click aquí</span></p>}
        
        
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>He leído y acepto los terminos y condiciones</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;