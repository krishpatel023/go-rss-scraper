"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function AddFeed({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Feed</DialogTitle>
            <DialogDescription>
              Add a new feed to your RSS reader
            </DialogDescription>
            <AddFeedForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Zod validation schema
const validationSchema = z.object({
  url: z.string().url("Invalid URL"),
  name: z
    .string()
    .min(1, "Feed name is required")
    .max(100, "Feed name is too long"),
});

export function AddFeedForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [validating, setValidating] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    url: "",
    name: "",
  });
  const [errors, setErrors] = useState<{
    url?: string;
    name?: string;
    main?: string;
  }>({});

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    if (id === "url") {
      setValidated(false);
    }
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  }

  function validateForm() {
    try {
      validationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as keyof typeof errors] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }

  async function handleFeedValidation(url: string) {
    return await api
      .post("/v1/feeds/validate-rss", { url })
      .then((res) => {
        setValidated(true);
        setErrors({});
        return res.data;
      })
      .catch((err) => {
        setErrors({
          url: err.response?.data?.error,
        });
        return err.response?.data?.error;
      });
  }

  async function Validate() {
    setValidating(true);
    await handleFeedValidation(formData.url);
    setValidating(false);
  }

  async function handleFeedAddition() {
    return await api
      .post("/v1/feeds", {
        url: formData.url,
        name: formData.name,
      })
      .then((res) => {
        return {
          success: true,
          data: res.data,
        };
      })
      .catch((err) => {
        return {
          success: false,
          data: err.response?.data?.message,
        };
      });
  }

  async function AddFeed() {
    if (validateForm()) {
      const res = await handleFeedAddition();
      if (res.success) {
        toast.success("Feed added successfully");
        setOpen(false);
      } else {
        toast.error("Failed to add feed");
        setErrors({
          main: res.data,
        });
      }
    }
  }

  return (
    <form className="space-y-6 pt-3" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <Label htmlFor="url">Feed URL</Label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              id="url"
              placeholder="https://example.com/feed.xml"
              type="url"
              className="w-full"
              value={formData.url}
              onChange={handleInputChange}
            />
            {errors.url && (
              <p className="text-sm text-red-500 mt-1">{errors.url}</p>
            )}
            {validated && (
              <p className="text-sm text-green-500 mt-1 ml-1">
                Your RSS Feed Url is Valid!
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={Validate}
            disabled={validating || validated}
          >
            <RefreshCcw
              className="h-4 w-4 mr-2 data-[validating=true]:animate-spin "
              data-validating={validating}
            />
            {validating ? "Validating" : "Validate"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Feed Name</Label>
        <Input
          id="name"
          placeholder="My Awesome Tech Blog"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      <div className="pt-4 flex justify-end space-x-2">
        {errors.main && (
          <p className="text-sm text-red-500 mt-1">{errors.main}</p>
        )}
        <Button
          disabled={!validated || !formData.url || !formData.name}
          className="w-full disabled:cursor-not-allowed"
          onClick={AddFeed}
        >
          Add Feed
        </Button>
      </div>
    </form>
  );
}
