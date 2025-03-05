import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Copy, DoorOpen, Loader2, ThumbsUp } from "lucide-react";

const App = () => {
  const [repoUrl, setrepoUrl] = useState<string>("");
  const [impoorting, setimporting] = useState<boolean>(false);
  const [imported, setImported] = useState<boolean>(false);
  const [deployed, setDeployed] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    if (repoUrl.length == 0) return;
    const intervalId = setInterval(async () => {
      const response = await fetch(`http://localhost:3000/status?id=${id}`);
      const data = await response.json();
      console.log("dtatus data:- ", data);
      if (data.status == "uploaded") {
        console.log("project uploaded");
        setimporting(false);
        setImported(true);
      }
      if (data.status == "deployed") {
        console.log("project deployed");
        clearInterval(intervalId);
        setDeployed(true);
      }
    }, 3000);
  }, [id]);

  const copyHandler = () => {
    navigator.clipboard.writeText(`http://localhost:3001/${id}/index.html`);
  };

  const redirectHandler = () => {
    window.location.href = `http://localhost:3001/${id}/index.html`;
  };

  const deploy = async () => {
    try {
      setimporting(true);
      const response = await fetch("http://localhost:3000/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: repoUrl }),
      });
      if (response) {
        const data = await response.json();
        setId(data.id);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("error occured while importing teh repo:- ", err.message);
      } else {
        console.log("unknown error ocuured while importing the repo..:-", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">GitHub Link</Label>
                <Input
                  id="name"
                  placeholder="https://github.com/username/reponame"
                  value={repoUrl}
                  onChange={(e) => setrepoUrl(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setrepoUrl("")}>
            Cancel
          </Button>
          {(() => {
            // Fully deployed state
            if (imported && deployed) {
              return (
                <Button className="flex gap-3">
                  <ThumbsUp />
                  Done
                </Button>
              );
            }

            // Deploying state (imported but not yet deployed)
            if (imported) {
              return (
                <Button disabled className="flex gap-3">
                  <Loader2 className="animate-spin" />
                  Deploying
                </Button>
              );
            }

            // Importing state
            if (impoorting) {
              return (
                <Button disabled className="flex gap-3">
                  <Loader2 className="animate-spin" />
                  Importing
                </Button>
              );
            }

            // Initial state
            return <Button onClick={deploy}>Deploy</Button>;
          })()}
        </CardFooter>
      </Card>
      {deployed && id && (
        <Card className="w-[450px] mt-7">
          <CardHeader>
            <CardTitle>Congratulations..🥳</CardTitle>
            <CardDescription>Your Project Got Deployed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-b-gray-800 px-4 py-2 rounded-2xl text-sm text-zinc-400 text-center">
              {`http://localhost:3001/${id}/index.html`}
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={copyHandler} className=" flex flex-1 gap-2">
              <Copy />
              Copy
            </Button>
            <Button onClick={redirectHandler} className="flex flex-1 gap-2">
              <DoorOpen />
              Open
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default App;
