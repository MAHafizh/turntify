import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  // const { isLoaded, isSignedIn, getToken, userId } = useAuth();

  // const handleGetToken = async () => {
  //   const token = await getToken();
  //   console.log("JWT:", token);
  //   console.log("UserId:", userId);
  // };

  // if (!isLoaded) return <p>Loading...</p>;
  // if (!isSignedIn) return <p>Belum login</p>;

  return (
    <>
      <p>Hello World</p>
      <header>
        {/* Show the sign-in and sign-up buttons when the user is signed out */}
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        {/* Show the user button when the user is signed in */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      {/* <Button onClick={handleGetToken} variant={"outline"}>
        Ambil token
      </Button> */}
    </>
  );
}

export default App;
