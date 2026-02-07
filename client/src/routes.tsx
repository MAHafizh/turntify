import { Route } from "react-router";
import Signin from "./signin";

export default function routes() {
  return [
    <Route path="/signin" element={<Signin/>}/>
  ]
}
