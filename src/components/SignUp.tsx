import { SignUpProps } from "./types"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignUp: React.FC<SignUpProps> = () => {

   const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  
}



export default SignUp