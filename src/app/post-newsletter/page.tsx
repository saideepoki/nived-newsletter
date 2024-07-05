"use client";

import { useState } from "react";
import { useEditor, EditorContent, NodeViewWrapper } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Typography from "@tiptap/extension-typography";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import { Button } from "@/components/ui/button";
import ListItem from "@tiptap/extension-list-item";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Highlighter,
  Italic,
  ListOrderedIcon,
  Loader2,
  PilcrowIcon,
  PlusCircle,
  Quote,
  Redo2,
  Ruler,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { ListBulletIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import DOMPurify from "dompurify";
import HardBreak from '@tiptap/extension-hard-break'



export default function Page() {
  const form = useForm();
  const [isPostSubmitting, SetIsPostSubmitting] = useState(false);
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Store Cloudinary URLs

  // Helper function to upload an image to Cloudinary
  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cmb7mj51"); // Replace with your upload preset
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dcnsxurw2/image/upload`, // Replace with your Cloudinary URL
      formData
    );
    return response.data.secure_url;
  }

  
  const CustomHardBreak = HardBreak.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => this.editor.commands.setHardBreak()
      };
    },
  });

  const extensions = [
    Document,
    StarterKit,
    Typography,
    TextStyle,
    Heading,
    ListItem,
    Color,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight,
    Image.configure({
      inline: true,
    }),
    ImageResize,
    FileHandler.configure({
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
      onDrop: async (currentEditor, files, pos) => {
        console.log("hi");
        for (const file of files) {
          try {
            const imageUrl = await uploadImage(file);
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: "image",
                attrs: {
                  src: imageUrl,
                },
              })
              .focus()
              .run();
            setUploadedImages((prev) => [...prev, imageUrl]);
            console.log("Images uploaded");
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      },
      onPaste: (currentEditor, files, htmlContent) => {
        files.forEach((file) => {
          const fileReader = new FileReader();

          fileReader.readAsDataURL(file);
          fileReader.onload = async () => {
            try {
              const imageUrl = await uploadImage(file);
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: imageUrl,
                  },
                })
                .focus()
                .run();
              setUploadedImages((prev) => [...prev, imageUrl]);
              console.log("Images uploaded");
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          };
        });
      },
    }),
    CustomHardBreak
  ];

  const editor = useEditor({
    extensions: extensions,
    content: "<h1>Write your content here! 🌎️</h1>",
    editorProps: {
      attributes: {
        class: cn("prose dark:prose-invert sm:prose-base focus:outline-none"),
      },
    },
  });

  if (!editor) {
    return null;
  }


  async function onSubmit(data: any) {
    const html = editor?.getHTML();
    const sanitizedContent = html ? DOMPurify.sanitize(html) : "";
    const { title } = data;
    console.log(title)
    console.log(sanitizedContent);

    try {
      SetIsPostSubmitting(true);
      const response = await axios.post("/api/newsletter", {
        title: title,
        content: sanitizedContent,
      });
      if (!response.data.success) {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.data.message,
        });
      }
      toast({
        title: "Success",
        variant: "default",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? "Error posting newsletter";
      toast({
        title: "Error",
        variant: "destructive",
        description: errorMessage,
      });
    } finally {
      SetIsPostSubmitting(false);
    }
  }


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col sm:mb-5 justify-center items-center bg-white text-black p-4 overflow-hidden">
        <div className="sticky mt-12 z-10 bg-white flex flex-wrap gap-2 mb-4 p-2 shadow-md w-full">
          {[
            {
              icon: <BoldIcon />,
              action: () => editor.chain().focus().toggleBold().run(),
              isActive: editor?.isActive("bold"),
            },
            {
              icon: <Italic />,
              action: () => editor.chain().focus().toggleItalic().run(),
              isActive: editor?.isActive("italic"),
            },
            {
              icon: <Strikethrough />,
              action: () => editor.chain().focus().toggleStrike().run(),
              isActive: editor?.isActive("strike"),
            },
            {
              icon: "Code",
              action: () => editor.chain().focus().toggleCode().run(),
              isActive: editor?.isActive("code"),
            },
            {
              icon: "Clear Marks",
              action: () => editor.chain().focus().unsetAllMarks().run(),
            },
            {
              icon: <PilcrowIcon />,
              action: () => editor.chain().focus().setParagraph().run(),
              isActive: editor?.isActive("paragraph"),
            },
            {
              icon: "H1",
              action: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
              isActive: editor?.isActive("heading", { level: 1 }),
            },
            {
              icon: "H2",
              action: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
              isActive: editor?.isActive("heading", { level: 2 }),
            },
            {
              icon: "H3",
              action: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
              isActive: editor?.isActive("heading", { level: 3 }),
            },
            {
              icon: "H4",
              action: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
              isActive: editor?.isActive("heading", { level: 4 }),
            },
            {
              icon: <ListBulletIcon />,
              action: () => editor.chain().focus().toggleBulletList().run(),
              isActive: editor?.isActive("bulletList"),
            },
            {
              icon: <ListOrderedIcon />,
              action: () => editor.chain().focus().toggleOrderedList().run(),
              isActive: editor?.isActive("orderedList"),
            },
            {
              icon: <Quote />,
              action: () => editor.chain().focus().toggleBlockquote().run(),
              isActive: editor?.isActive("blockquote"),
            },
            {
              icon: <Ruler />,
              action: () => editor.chain().focus().setHorizontalRule().run(),
            },
            {
              icon: "Hard break",
              action: () => editor.chain().focus().setHorizontalRule().run(),
            },
            {
              icon: <Undo2 />,
              action: () => editor.chain().focus().undo().run(),
              isActive: editor?.can().chain().focus().undo().run(),
            },
            {
              icon: <Redo2 />,
              action: () => editor.chain().focus().redo().run(),
              isActive: editor?.can().chain().focus().redo().run(),
            },
            {
              icon: <AlignLeft />,
              action: () => editor.chain().focus().setTextAlign("left").run(),
              isActive: editor?.isActive({ textAlign: "left" }),
            },
            {
              icon: <AlignRight />,
              action: () => editor.chain().focus().setTextAlign("right").run(),
              isActive: editor?.isActive({ textAlign: "right" }),
            },
            {
              icon: <AlignCenter />,
              action: () => editor.chain().focus().setTextAlign("center").run(),
              isActive: editor?.isActive({ textAlign: "center" }),
            },
            {
              icon: <Highlighter />,
              action: () => editor.chain().focus().toggleHighlight().run(),
              isActive: editor?.isActive("highlight"),
            }
          ].map(({ icon, action, isActive }, index) => (
            <Button
              key={index}
              onClick={action}
              disabled={!editor?.can().chain().focus().run()}
              className={cn(
                "bg-gray-300",
                isActive ? "bg-zinc-950 text-white" : ""
              )}
            >
              {icon}
            </Button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4 justify-center items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter title"
                        className="bg-zinc-950 text-white w-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="bg-zinc-950 rounded-md p-4 shadow-md">
                <EditorContent editor={editor} />
              </div>
            </form>
          </Form>
        </div>
        <div className="sticky bottom-0 bg-white p-4 shadow-md">
          <Button
            className="bg-zinc-950 hover:bg-zinc-800 text-white w-full"
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            Post
          </Button>
          {isPostSubmitting && (
            <div className="flex items-center justify-center mt-3 text-zinc-950">
              <Loader2 className="h-5 w-5 animate-spin mr-2"/>
              <span>Please wait</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar for future AI implementation */}
      <div className="w-1/3 text-black bg-gray-200 p-8 mt-12">
        <h2 className="text-xl font-bold">AI Features</h2>
        <p>Future AI tools and features will be placed here.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled
                      className="text-white bg-zinc-950 mt-5 flex-1 rounded-lg"
                      rows={15}
                      placeholder="To be implemented"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled
              className="mt-5 bg-zinc-950 text-white hover:bg-zinc-800 w-full"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
