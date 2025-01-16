"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface InputField {
  name: string;
  label: string;
  type: string;
  options?: Array<{ value: string; label: string; group?: string }>;
  fullWidth?: boolean;
  render?: () => React.ReactNode;
}

interface InputGroup {
  title: string;
  description: string;
  fields: InputField[];
}

const PromptGenerator = () => {
  const [formData, setFormData] = useState({
    // Basic composition
    medium: "",
    subject: "",
    environment: "",

    // Technical aspects
    view: "",
    camera: "",
    lens: "",
    lighting: "",

    // Style and mood
    descriptorI: "", // mood/emotion
    descriptorII: "", // art movement
    artist: "",
    filmStyle: "",
    timeEpoch: "",

    // Parameters
    aspectRatio: "16:9",
    styleReference: "",
    styleReferenceUrl: "",
    ignoreWords: "",
    tile: false,
    styleRaw: false,
    version: "--v 6.1",
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generatePrompt = () => {
    const elements = [
      // Style Reference URL
      formData.styleReferenceUrl,

      // Basic composition
      [formData.medium === "None" ? "" : formData.medium, formData.subject].filter(Boolean).join(" of "),

      // Environment
      formData.environment,

      // Technical aspects
      formData.view !== "None" && formData.view,
      formData.camera !== "None" && formData.camera,
      formData.lens !== "None" && formData.lens,
      formData.lighting !== "None" && formData.lighting,

      // Style and mood
      formData.descriptorI !== "None" && formData.descriptorI,
      formData.descriptorII !== "None" && formData.descriptorII,
      formData.artist !== "None" && formData.artist && `by ${formData.artist}`,
      formData.filmStyle !== "None" && formData.filmStyle && `${formData.filmStyle} film style`,
      formData.timeEpoch !== "None" && formData.timeEpoch && `Time Period: ${formData.timeEpoch}`
    ];

    // Build parameters string
    const parameters = [
      formData.tile && "--tile",
      formData.styleRaw && "--style raw",
      formData.aspectRatio && `--ar ${formData.aspectRatio}`,
      formData.ignoreWords && `--no ${formData.ignoreWords}`,
      formData.styleReference && `--sref ${formData.styleReference}`,
      formData.version,
    ]
      .filter(Boolean)
      .join(" ");

    return `${elements.filter(Boolean).join(", ")} ${parameters}`;
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatePrompt());
    // Could add a toast notification here
  };

  const renderInputGroup = ({ title, description, fields }: InputGroup) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold uppercase">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {fields.map(({ name, label, type, options, fullWidth, render }) => (
            <div
              key={name}
              className={`grid w-full items-center gap-1.5 ${
                fullWidth ? "col-span-1" : "md:col-span-1"
              }`}
            >
              {type === "custom" && render ? (
                render()
              ) : type === "select" ? (
                <>
                  <Label htmlFor={name} className="font-bold">{label}</Label>
                  <Select
                    value={formData[name as keyof typeof formData] as string}
                    onValueChange={(value) => handleInputChange(name, value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder=" ">
                        {formData[name as keyof typeof formData] === "None" ? "" : formData[name as keyof typeof formData]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {/* Group options by their group */}
                      {Array.from(new Set(options?.filter(opt => opt.group).map(opt => opt.group))).map(group => (
                        group === 'none' ? (
                          <SelectItem key="none" value="None">None</SelectItem>
                        ) : (
                          <SelectGroup key={group} className="pb-2">
                            <SelectLabel>{group}</SelectLabel>
                            {options?.filter(opt => opt.group === group).map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : type === "checkbox" ? (
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox
                    id={name}
                    checked={formData[name as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      handleInputChange(name, !!checked)
                    }
                  />
                  <span className="text-sm text-gray-600">Enable</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={name} className="font-bold uppercase">{label}</Label>
                  <CardDescription className="text-sm">
                    {name === "subject" ? "Describe the main focus of your image" :
                     name === "environment" ? "Describe the setting or background" : ""}
                  </CardDescription>
                  <Textarea
                    id={name}
                    // type="text"
                    value={formData[name as keyof typeof formData] as string}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    className="h-10"
                    placeholder={
                      name === "subject" ? "E.g., A majestic lion, A futuristic cityscape" :
                      name === "environment" ? "E.g., lush jungle, bustling marketplace" : ""
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-4xl mx-auto mb-32">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-normal text-gray-600">
            Midjourney Prompt Helper{" "}
          </CardTitle>
          <CardDescription>
            <span className="descriptionblack">
              A handy tool for generating advanced prompts in{" "}
              <Link
                href="https://midjourney.com/"
                target="_blank"
                className="text-purple-600 hover:underline"
              >
                Midjourney
              </Link>
              . Version 2.1 - November 2024 -{" "}
              <Link
                href="https://github.com/gummiz/Midjourney-Generator-v2"
                target="_blank"
                className="text-purple-600 hover:underline"
              >
                Quickguide
              </Link>
            </span>
            <br />
            Developed by Stefan Kummerlöw. Connect with me on{" "}
            <Link
              href="https://bit.ly/kummerloewLinkedIn"
              target="_blank"
              className="text-purple-600 hover:underline"
            >
              LinkedIn
            </Link>
            ,{" "}
            <Link
              href="https://bit.ly/GithubTadaptive"
              target="_blank"
              className="text-purple-600 hover:underline"
            >
              GitHub
            </Link>
            ,{" "}
            <Link
              href="https://bit.ly/XTadaptive"
              target="_blank"
              className="text-purple-600 hover:underline"
            >
              X
            </Link>{" "}
            and{" "}
            <Link
              href="https://bit.ly/IGTadaptive"
              target="_blank"
              className="text-purple-600 hover:underline"
            >
              Instagram
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>

      <form className="space-y-6">
        {renderInputGroup({
          title: "Basic Composition",
          description:
            "Choose the artistic medium and describe the main focus of your image",
          fields: [
            {
              name: "medium",
              label: "Medium",
              type: "select",
              fullWidth: false,
              options: [
                { value: "none", label: "None", group: "none" },
                // Favorite Mediums
                { value: "Photograph", label: "Photograph", group: "Favorite Mediums" },
                { value: "Product Photography", label: "Product Photography", group: "Favorite Mediums" },
                { value: "Commercial Photography", label: "Commercial Photography", group: "Favorite Mediums" },
                { value: "Studio Photography", label: "Studio Photography", group: "Favorite Mediums" },
                { value: "Illustration", label: "Illustration", group: "Favorite Mediums" },
                { value: "Character design sheet", label: "Character design sheet", group: "Favorite Mediums" },
                { value: "3D Model", label: "3D Model", group: "Favorite Mediums" },

                // 2D Mediums
                { value: "Film Still", label: "Film Still", group: "2D Mediums" },
                { value: "Cinematic Portrait", label: "Cinematic Portrait", group: "2D Mediums" },
                { value: "Drawing", label: "Drawing", group: "2D Mediums" },
                { value: "Painting", label: "Painting", group: "2D Mediums" },
                { value: "3D rendering", label: "3D rendering", group: "2D Mediums" },
                { value: "3D Clay Rendered Icon", label: "3D Clay Rendered Icon", group: "2D Mediums" },
                { value: "Animation", label: "Animation", group: "2D Mediums" },
                { value: "Billboard", label: "Billboard", group: "2D Mediums" },
                { value: "Blueprint", label: "Blueprint", group: "2D Mediums" },
                { value: "Risograph", label: "Risograph", group: "2D Mediums" },
                { value: "Brochure", label: "Brochure", group: "2D Mediums" },
                { value: "Calligraphy", label: "Calligraphy", group: "2D Mediums" },
                { value: "Cartoon", label: "Cartoon", group: "2D Mediums" },
                { value: "Collage", label: "Collage", group: "2D Mediums" },
                { value: "Comic book", label: "Comic book", group: "2D Mediums" },
                { value: "Digital art", label: "Digital art", group: "2D Mediums" },
                { value: "Flyer", label: "Flyer", group: "2D Mediums" },
                { value: "Folk Art", label: "Folk Art", group: "2D Mediums" },
                { value: "Icon", label: "Icon", group: "2D Mediums" },
                { value: "Infographic", label: "Infographic", group: "2D Mediums" },
                { value: "Logo", label: "Logo", group: "2D Mediums" },
                { value: "Magazine", label: "Magazine", group: "2D Mediums" },
                { value: "Map", label: "Map", group: "2D Mediums" },
                { value: "Movie poster", label: "Movie poster", group: "2D Mediums" },
                { value: "Pixel art", label: "Pixel art", group: "2D Mediums" },
                { value: "Poster", label: "Poster", group: "2D Mediums" },
                { value: "Vector art", label: "Vector art", group: "2D Mediums" },
                { value: "Wall mural", label: "Wall mural", group: "2D Mediums" },
                { value: "Woodblock print", label: "Woodblock print", group: "2D Mediums" },

                // Drawing Techniques
                { value: "Anatomical drawing", label: "Anatomical drawing", group: "Drawing Techniques" },
                { value: "Anime", label: "Anime", group: "Drawing Techniques" },
                { value: "Aquarelle", label: "Aquarelle", group: "Drawing Techniques" },
                { value: "Ballpoint pen drawing", label: "Ballpoint pen drawing", group: "Drawing Techniques" },
                { value: "Chalk drawing", label: "Chalk drawing", group: "Drawing Techniques" },
                { value: "Charcoal drawing", label: "Charcoal drawing", group: "Drawing Techniques" },
                { value: "Colored pencil drawing", label: "Colored pencil drawing", group: "Drawing Techniques" },
                { value: "Comics", label: "Comics", group: "Drawing Techniques" },
                { value: "Crosshatch drawing", label: "Crosshatch drawing", group: "Drawing Techniques" },
                { value: "India ink drawing", label: "India ink drawing", group: "Drawing Techniques" },
                { value: "Ink drawing", label: "Ink drawing", group: "Drawing Techniques" },
                { value: "Marker drawing", label: "Marker drawing", group: "Drawing Techniques" },
                { value: "Pastel drawing", label: "Pastel drawing", group: "Drawing Techniques" },
                { value: "Pencil drawing", label: "Pencil drawing", group: "Drawing Techniques" },
                { value: "Pointillism drawing", label: "Pointillism drawing", group: "Drawing Techniques" },

                // Painting Techniques
                { value: "Acrylic painting", label: "Acrylic painting", group: "Painting Techniques" },
                { value: "Airbrush painting", label: "Airbrush painting", group: "Painting Techniques" },
                { value: "Digital painting", label: "Digital painting", group: "Painting Techniques" },
                { value: "Fresco painting", label: "Fresco painting", group: "Painting Techniques" },
                { value: "Gouache painting", label: "Gouache painting", group: "Painting Techniques" },
                { value: "Graffiti painting", label: "Graffiti painting", group: "Painting Techniques" },
                { value: "Oil painting", label: "Oil painting", group: "Painting Techniques" },
                { value: "Pastel painting", label: "Pastel painting", group: "Painting Techniques" },
                { value: "Watercolor painting", label: "Watercolor painting", group: "Painting Techniques" },
                { value: "Street art painting", label: "Street art painting", group: "Painting Techniques" },

                // Photography
                { value: "35mm film photography", label: "35mm film photography", group: "Photography" },
                { value: "Analog photography", label: "Analog photography", group: "Photography" },
                { value: "Digital photography", label: "Digital photography", group: "Photography" },
                { value: "Infrared photography", label: "Infrared photography", group: "Photography" },
                { value: "Lomography", label: "Lomography", group: "Photography" },
                { value: "Polaroid photography", label: "Polaroid photography", group: "Photography" },
                { value: "Portrait photography", label: "Portrait photography", group: "Photography" },
                { value: "Product photography", label: "Product photography", group: "Photography" },
                { value: "Vintage film photography", label: "Vintage film photography", group: "Photography" },

                // 3D Techniques
                { value: "Claymation", label: "Claymation", group: "3D Techniques" },
                { value: "Diorama", label: "Diorama", group: "3D Techniques" },
                { value: "Glass sculpture", label: "Glass sculpture", group: "3D Techniques" },
                { value: "Ice sculpture", label: "Ice sculpture", group: "3D Techniques" },
                { value: "Origami", label: "Origami", group: "3D Techniques" },
                { value: "Paper mache sculpture", label: "Paper mache sculpture", group: "3D Techniques" },
                { value: "Pottery", label: "Pottery", group: "3D Techniques" },
                { value: "Sculpture", label: "Sculpture", group: "3D Techniques" },
                { value: "Stained glass", label: "Stained glass", group: "3D Techniques" },

                // Displays
                { value: "4k display", label: "4k display", group: "Displays" },
                { value: "CRT display", label: "CRT display", group: "Displays" },
                { value: "Holograph display", label: "Holograph display", group: "Displays" },
                { value: "LCD display", label: "LCD display", group: "Displays" },
                { value: "LED display", label: "LED display", group: "Displays" },
                { value: "OLED display", label: "OLED display", group: "Displays" },
                { value: "Plasma display", label: "Plasma display", group: "Displays" },
                { value: "VHS tape", label: "VHS tape", group: "Displays" }
              ]
            },
            {
              name: "subject",
              label: "Subject",
              type: "text",
              fullWidth: true,
              render: () => (
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-bold">SUBJECT</Label>
                  <CardDescription className="text-sm">Describe the main focus of your image</CardDescription>
                  <Textarea
                    id="subject"
                    // type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    className="h-10"
                    placeholder="E.g., A majestic lion, A futuristic cityscape"
                  />
                </div>
              )
            },
            {
              name: "environment",
              label: "Environment",
              type: "text",
              fullWidth: true,
              render: () => (
                <div className="space-y-2">
                  <Label htmlFor="environment" className="font-bold">ENVIRONMENT</Label>
                  <CardDescription className="text-sm">Describe the setting or background</CardDescription>
                  <Textarea
                    id="environment"
                    // type="text"
                    value={formData.environment}
                    onChange={(e) => handleInputChange("environment", e.target.value)}
                    className="h-10"
                    placeholder="E.g., lush jungle, bustling marketplace"
                  />
                </div>
              )
            },
          ],
        })}

        {renderInputGroup({
          title: "Technical Aspects",
          description: "Define the visual arrangement and technical aspects",
          fields: [
            {
              name: "view",
              label: "View",
              type: "select",
              options: [
                { value: "None", label: "None", group: "none" },
                // Basic Views
                { value: "Front view", label: "Front view", group: "Basic Views" },
                { value: "Back view", label: "Back view", group: "Basic Views" },
                { value: "Side view", label: "Side view", group: "Basic Views" },
                { value: "Profile view", label: "Profile view", group: "Basic Views" },
                { value: "Top view", label: "Top view", group: "Basic Views" },
                { value: "Bottom view", label: "Bottom view", group: "Basic Views" },

                // Angled Views
                { value: "Three-quarter view", label: "Three-quarter view", group: "Angled Views" },
                { value: "45-degree view", label: "45-degree view", group: "Angled Views" },
                { value: "Diagonal view", label: "Diagonal view", group: "Angled Views" },
                { value: "Isometric view", label: "Isometric view", group: "Angled Views" },
                // Distance
                { value: "Close-up", label: "Close-up", group: "Distance" },
                { value: "Extreme close-up", label: "Extreme close-up", group: "Distance" },
                { value: "Medium shot", label: "Medium shot", group: "Distance" },
                { value: "Long shot", label: "Long shot", group: "Distance" },
                { value: "Extreme long shot", label: "Extreme long shot", group: "Distance" },
                { value: "Wide angle", label: "Wide angle", group: "Distance" },
                { value: "Ultra wide", label: "Ultra wide", group: "Distance" },
                { value: "Macro", label: "Macro", group: "Distance" },
                { value: "Telephoto", label: "Telephoto", group: "Distance" },
                { value: "Super telephoto", label: "Super telephoto", group: "Distance" },
                // Perspective
                { value: "Aerial view", label: "Aerial view", group: "Perspective" },
                { value: "Drone view", label: "Drone view", group: "Perspective" },
                { value: "First person", label: "First person", group: "Perspective" },
                { value: "Third person", label: "Third person", group: "Perspective" },
                { value: "Over the shoulder", label: "Over the shoulder", group: "Perspective" },
                { value: "Isometric", label: "Isometric", group: "Perspective" },
                { value: "Dimetric", label: "Dimetric", group: "Perspective" },
                { value: "Low angle", label: "Low angle", group: "Perspective" },
                { value: "High angle", label: "High angle", group: "Perspective" },
                { value: "Oblique angle", label: "Oblique angle", group: "Perspective" },
                // Technical Views
                { value: "Cross-sectional view", label: "Cross-sectional view", group: "Technical Views" },
                { value: "Exploded view", label: "Exploded view", group: "Technical Views" },
                { value: "Orthographic view", label: "Orthographic view", group: "Technical Views" },
                { value: "Follow view", label: "Follow view", group: "Technical Views" },
                // Special Effects
                { value: "Shallow depth of field", label: "Shallow depth of field", group: "Special Effects" },
                { value: "Deep depth of field", label: "Deep depth of field", group: "Special Effects" },
                { value: "Dutch angle", label: "Dutch angle", group: "Special Effects" },
                { value: "Panoramic view", label: "Panoramic view", group: "Special Effects" },
                { value: "360-degree view", label: "360-degree view", group: "Special Effects" },
                { value: "Fish eye", label: "Fish eye", group: "Special Effects" },
                { value: "Tilt shift", label: "Tilt shift", group: "Special Effects" },
                { value: "Double exposure", label: "Double exposure", group: "Special Effects" },
                { value: "Multiple exposure", label: "Multiple exposure", group: "Special Effects" },
                { value: "Motion blur", label: "Motion blur", group: "Special Effects" },
                { value: "Long exposure", label: "Long exposure", group: "Special Effects" },
                { value: "Time-lapse", label: "Time-lapse", group: "Special Effects" }
              ]
            },
            {
              name: "camera",
              label: "Camera",
              type: "select",
              options: [
                { value: "None", label: "None", group: "none" },
                // Professional Cameras
                { value: "Canon EOS R5", label: "Canon EOS R5", group: "Professional Cameras" },
                { value: "Sony A7R IV", label: "Sony A7R IV", group: "Professional Cameras" },
                { value: "Nikon Z9", label: "Nikon Z9", group: "Professional Cameras" },
                // Medium Format
                { value: "Fujifilm GFX 100S", label: "Fujifilm GFX 100S", group: "Medium Format" },
                { value: "Hasselblad X2D", label: "Hasselblad X2D", group: "Medium Format" },
                // Rangefinder
                { value: "Leica M11", label: "Leica M11", group: "Rangefinder" }
              ]
            },
            {
              name: "lens",
              label: "Lens",
              type: "select",
              options: [
                { value: "None", label: "None", group: "none" },
                // Wide Angle
                { value: "16mm f/2.8", label: "16mm f/2.8", group: "Wide Angle" },
                { value: "24mm f/1.4", label: "24mm f/1.4", group: "Wide Angle" },
                // Standard
                { value: "35mm f/1.4", label: "35mm f/1.4", group: "Standard" },
                { value: "50mm f/1.2", label: "50mm f/1.2", group: "Standard" },
                // Telephoto
                { value: "85mm f/1.4", label: "85mm f/1.4", group: "Telephoto" }
              ]
            },
            {
              name: "lighting",
              label: "Lighting",
              type: "select",
              options: [
                { value: "None", label: "None", group: "none" },
                // Natural Light
                { value: "Natural daylight", label: "Natural daylight", group: "Natural Light" },
                { value: "Golden hour sunlight", label: "Golden hour sunlight", group: "Natural Light" },
                { value: "Daylight", label: "Daylight", group: "Natural Light" },
                { value: "Morning light", label: "Morning light", group: "Natural Light" },
                { value: "Twilight lighting", label: "Twilight lighting", group: "Natural Light" },
                { value: "Moonlight", label: "Moonlight", group: "Natural Light" },
                // Studio Lighting
                { value: "Studio lighting", label: "Studio lighting", group: "Studio Lighting" },
                { value: "Soft lighting", label: "Soft lighting", group: "Studio Lighting" },
                { value: "Dramatic lighting", label: "Dramatic lighting", group: "Studio Lighting" },
                { value: "Backlighting", label: "Backlighting", group: "Studio Lighting" },
                { value: "Overhead lighting", label: "Overhead lighting", group: "Studio Lighting" },
                // Artificial Light
                { value: "Incandescent lighting", label: "Incandescent lighting", group: "Artificial Light" },
                { value: "Fluorescent lighting", label: "Fluorescent lighting", group: "Artificial Light" },
                { value: "Neon lighting", label: "Neon lighting", group: "Artificial Light" },
                { value: "LED lights", label: "LED lights", group: "Artificial Light" },
                { value: "Wall sconce light", label: "Wall sconce light", group: "Artificial Light" },
                { value: "Pendant light", label: "Pendant light", group: "Artificial Light" },
                { value: "Night light", label: "Night light", group: "Artificial Light" },
                { value: "Edison bulb", label: "Edison bulb", group: "Artificial Light" },
                { value: "Vacuum tube bulb", label: "Vacuum tube bulb", group: "Artificial Light" },
                { value: "Nixie tube bulb", label: "Nixie tube bulb", group: "Artificial Light" },
                { value: "Christmas lights", label: "Christmas lights", group: "Artificial Light" },
                { value: "Party lighting", label: "Party lighting", group: "Artificial Light" },
                // Special Lighting
                { value: "Bioluminescence", label: "Bioluminescence", group: "Special Lighting" },
                { value: "Candle light", label: "Candle light", group: "Special Lighting" },
                { value: "Firelight", label: "Firelight", group: "Special Lighting" },
                { value: "Black light", label: "Black light", group: "Special Lighting" },
                { value: "UV light", label: "UV light", group: "Special Lighting" }
              ]
            },
          ],
        })}

        {renderInputGroup({
          title: "Style & Mood",
          description: "Define the artistic style and mood",
          fields: [
            {
              name: "descriptorI",
              label: "Mood/Emotion",
              type: "select",
              options: [
                // { value: 'None', label: 'None', group: "Basic Emotions" },
                // Basic Emotions
                { value: "Happy", label: "Happy", group: "Basic Emotions" },
                { value: "Sad", label: "Sad", group: "Basic Emotions" },
                { value: "Angry", label: "Angry", group: "Basic Emotions" },
                { value: "Fearful", label: "Fearful", group: "Basic Emotions" },
                {
                  value: "Surprised",
                  label: "Surprised",
                  group: "Basic Emotions",
                },
                {
                  value: "Disgusted",
                  label: "Disgusted",
                  group: "Basic Emotions",
                },
                // Positive Moods
                { value: "Joyful", label: "Joyful", group: "Positive Moods" },
                { value: "Excited", label: "Excited", group: "Positive Moods" },
                {
                  value: "Peaceful",
                  label: "Peaceful",
                  group: "Positive Moods",
                },
                { value: "Serene", label: "Serene", group: "Positive Moods" },
                { value: "Content", label: "Content", group: "Positive Moods" },
                {
                  value: "Optimistic",
                  label: "Optimistic",
                  group: "Positive Moods",
                },
                { value: "Playful", label: "Playful", group: "Positive Moods" },
                // Negative Moods
                {
                  value: "Melancholic",
                  label: "Melancholic",
                  group: "Negative Moods",
                },
                { value: "Gloomy", label: "Gloomy", group: "Negative Moods" },
                { value: "Anxious", label: "Anxious", group: "Negative Moods" },
                {
                  value: "Depressed",
                  label: "Depressed",
                  group: "Negative Moods",
                },
                {
                  value: "Frustrated",
                  label: "Frustrated",
                  group: "Negative Moods",
                },
                { value: "Lonely", label: "Lonely", group: "Negative Moods" },
                // Complex Moods
                {
                  value: "Nostalgic",
                  label: "Nostalgic",
                  group: "Complex Moods",
                },
                {
                  value: "Mysterious",
                  label: "Mysterious",
                  group: "Complex Moods",
                },
                {
                  value: "Contemplative",
                  label: "Contemplative",
                  group: "Complex Moods",
                },
                {
                  value: "Bittersweet",
                  label: "Bittersweet",
                  group: "Complex Moods",
                },
                {
                  value: "Ambivalent",
                  label: "Ambivalent",
                  group: "Complex Moods",
                },
                // Atmospheric Moods
                {
                  value: "Ethereal",
                  label: "Ethereal",
                  group: "Atmospheric Moods",
                },
                {
                  value: "Dramatic",
                  label: "Dramatic",
                  group: "Atmospheric Moods",
                },
                {
                  value: "Mystical",
                  label: "Mystical",
                  group: "Atmospheric Moods",
                },
                {
                  value: "Whimsical",
                  label: "Whimsical",
                  group: "Atmospheric Moods",
                },
                {
                  value: "Chaotic",
                  label: "Chaotic",
                  group: "Atmospheric Moods",
                },
                {
                  value: "Tranquil",
                  label: "Tranquil",
                  group: "Atmospheric Moods",
                },
                // Energetic States
                {
                  value: "Vibrant",
                  label: "Vibrant",
                  group: "Energetic States",
                },
                {
                  value: "Energetic",
                  label: "Energetic",
                  group: "Energetic States",
                },
                {
                  value: "Dynamic",
                  label: "Dynamic",
                  group: "Energetic States",
                },
                { value: "Bold", label: "Bold", group: "Energetic States" },
                {
                  value: "Intense",
                  label: "Intense",
                  group: "Energetic States",
                },
              ],
            },
            {
              name: "descriptorII",
              label: "Art Movement",
              type: "select",
              options: [
                { value: "None", label: "None", group: "none" },
                // Classical Movements
                { value: "Baroque", label: "Baroque", group: "Classical Movements" },
                { value: "Renaissance", label: "Renaissance", group: "Classical Movements" },
                { value: "Romanticism", label: "Romanticism", group: "Classical Movements" },
                // Modern Movements
                { value: "Art Deco", label: "Art Deco", group: "Modern Movements" },
                { value: "Art Nouveau", label: "Art Nouveau", group: "Modern Movements" },
                { value: "Bauhaus", label: "Bauhaus", group: "Modern Movements" },
                { value: "Cubism", label: "Cubism", group: "Modern Movements" },
                { value: "Expressionism", label: "Expressionism", group: "Modern Movements" },
                { value: "Impressionism", label: "Impressionism", group: "Modern Movements" },
                { value: "Minimalism", label: "Minimalism", group: "Modern Movements" },
                { value: "Pop Art", label: "Pop Art", group: "Modern Movements" },
                { value: "Surrealism", label: "Surrealism", group: "Modern Movements" },
                // Contemporary Styles
                { value: "Street Art", label: "Street Art", group: "Contemporary Styles" },
                { value: "Digital Art", label: "Digital Art", group: "Contemporary Styles" },
                { value: "Conceptual Art", label: "Conceptual Art", group: "Contemporary Styles" },
                // Regional Styles
                { value: "Ukiyo-e", label: "Ukiyo-e", group: "Regional Styles" },
                { value: "Chinese Painting", label: "Chinese Painting", group: "Regional Styles" },
                { value: "Persian Miniature", label: "Persian Miniature", group: "Regional Styles" }
              ]
            },
            {
              name: "timeEpoch",
              label: "Time Period",
              type: "select",
              options: [
                { value: "None", label: "None", group: "none" },
                // Ancient Times
                { value: "Ancient", label: "Ancient (3000 BCE - 500 CE)", group: "Ancient Times" },
                { value: "Classical", label: "Classical (500 BCE - 500 CE)", group: "Ancient Times" },
                // Middle Ages
                { value: "Medieval", label: "Medieval (500-1400)", group: "Middle Ages" },
                { value: "Renaissance", label: "Renaissance (1400-1600)", group: "Middle Ages" },
                // Early Modern
                { value: "Baroque", label: "Baroque (1600-1750)", group: "Early Modern" },
                { value: "Enlightenment", label: "Enlightenment (1700-1800)", group: "Early Modern" },
                // Modern Era
                { value: "Victorian", label: "Victorian (1837-1901)", group: "Modern Era" },
                { value: "Modern", label: "Modern (1901-1945)", group: "Modern Era" },
                { value: "Post-Modern", label: "Post-Modern (1945-2000)", group: "Modern Era" },
                // Contemporary & Future
                { value: "Contemporary", label: "Contemporary (2000-Present)", group: "Contemporary & Future" },
                { value: "Futuristic", label: "Futuristic", group: "Contemporary & Future" }
              ]
            },
          ],
        })}

        {renderInputGroup({
          title: "Artist & Film Style",
          description: "Add artist influence and cinematic style",
          fields: [
            {
              name: "artist",
              label: "Artist",
              type: "select",
              options: [
                { value: "None", label: "None", group: "none" },
                // Famous Artists
                {
                  value: "Leonardo da Vinci",
                  label: "Leonardo da Vinci",
                  group: "Renaissance Masters",
                },
                {
                  value: "Michelangelo",
                  label: "Michelangelo",
                  group: "Renaissance Masters",
                },
                {
                  value: "Raphael",
                  label: "Raphael",
                  group: "Renaissance Masters",
                },
                // Impressionists
                {
                  value: "Claude Monet",
                  label: "Claude Monet",
                  group: "Impressionists",
                },
                {
                  value: "Vincent van Gogh",
                  label: "Vincent van Gogh",
                  group: "Impressionists",
                },
                {
                  value: "Pierre-Auguste Renoir",
                  label: "Pierre-Auguste Renoir",
                  group: "Impressionists",
                },
                {
                  value: "Edgar Degas",
                  label: "Edgar Degas",
                  group: "Impressionists",
                },
                // Modern Artists
                {
                  value: "Pablo Picasso",
                  label: "Pablo Picasso",
                  group: "Modern Masters",
                },
                {
                  value: "Salvador Dalí",
                  label: "Salvador Dalí",
                  group: "Modern Masters",
                },
                {
                  value: "Andy Warhol",
                  label: "Andy Warhol",
                  group: "Modern Masters",
                },
                {
                  value: "Frida Kahlo",
                  label: "Frida Kahlo",
                  group: "Modern Masters",
                },
                {
                  value: "Georgia O'Keeffe",
                  label: "Georgia O'Keeffe",
                  group: "Modern Masters",
                },
                // Contemporary Artists
                {
                  value: "Banksy",
                  label: "Banksy",
                  group: "Contemporary Artists",
                },
                {
                  value: "Yayoi Kusama",
                  label: "Yayoi Kusama",
                  group: "Contemporary Artists",
                },
                {
                  value: "Ai Weiwei",
                  label: "Ai Weiwei",
                  group: "Contemporary Artists",
                },
                {
                  value: "Jeff Koons",
                  label: "Jeff Koons",
                  group: "Contemporary Artists",
                },
                // Digital Artists
                { value: "Beeple", label: "Beeple", group: "Digital Artists" },
                {
                  value: "Simon Stålenhag",
                  label: "Simon Stålenhag",
                  group: "Digital Artists",
                },
                {
                  value: "Artgerm",
                  label: "Artgerm",
                  group: "Digital Artists",
                },
                {
                  value: "Ross Tran",
                  label: "Ross Tran",
                  group: "Digital Artists",
                },
              ],
            },
            {
              name: "filmStyle",
              label: "Film Style",
              type: "select",
              options: [
                { value: "None", label: "None", group: "none" },
                // Film Noir
                {
                  value: "The Maltese Falcon",
                  label: "The Maltese Falcon",
                  group: "Film Noir",
                },
                {
                  value: "Double Indemnity",
                  label: "Double Indemnity",
                  group: "Film Noir",
                },
                {
                  value: "Touch of Evil",
                  label: "Touch of Evil",
                  group: "Film Noir",
                },
                // Science Fiction
                {
                  value: "Blade Runner",
                  label: "Blade Runner",
                  group: "Science Fiction",
                },
                {
                  value: "2001: A Space Odyssey",
                  label: "2001: A Space Odyssey",
                  group: "Science Fiction",
                },
                {
                  value: "The Matrix",
                  label: "The Matrix",
                  group: "Science Fiction",
                },
                { value: "Dune", label: "Dune", group: "Science Fiction" },
                // Horror
                { value: "The Shining", label: "The Shining", group: "Horror" },
                { value: "Nosferatu", label: "Nosferatu", group: "Horror" },
                { value: "Alien", label: "Alien", group: "Horror" },
                // Fantasy
                {
                  value: "The Lord of the Rings",
                  label: "The Lord of the Rings",
                  group: "Fantasy",
                },
                {
                  value: "Pan's Labyrinth",
                  label: "Pan's Labyrinth",
                  group: "Fantasy",
                },
                {
                  value: "The Dark Crystal",
                  label: "The Dark Crystal",
                  group: "Fantasy",
                },
                // Western
                {
                  value: "The Good, the Bad and the Ugly",
                  label: "The Good, the Bad and the Ugly",
                  group: "Western",
                },
                {
                  value: "Once Upon a Time in the West",
                  label: "Once Upon a Time in the West",
                  group: "Western",
                },
                // Animation
                {
                  value: "Studio Ghibli",
                  label: "Studio Ghibli",
                  group: "Animation",
                },
                {
                  value: "Disney Animation",
                  label: "Disney Animation",
                  group: "Animation",
                },
                { value: "Pixar", label: "Pixar", group: "Animation" },
                // Directors
                {
                  value: "Wes Anderson",
                  label: "Wes Anderson",
                  group: "Directors",
                },
                {
                  value: "Stanley Kubrick",
                  label: "Stanley Kubrick",
                  group: "Directors",
                },
                {
                  value: "Christopher Nolan",
                  label: "Christopher Nolan",
                  group: "Directors",
                },
                {
                  value: "Tim Burton",
                  label: "Tim Burton",
                  group: "Directors",
                },
                {
                  value: "Quentin Tarantino",
                  label: "Quentin Tarantino",
                  group: "Directors",
                },
              ],
            },
          ],
        })}

        {renderInputGroup({
          title: "Additional Parameters",
          description: "Define additional parameters for your image",
          fields: [
            {
              name: "aspectRatio",
              label: "Aspect Ratio",
              type: "select",
              options : [
                // Standard Ratios
                { value: "1:1", label: "Square (1:1)", group: "Standard Ratios" },

                // Landscape Ratios
                { value: "4:3", label: "Landscape (4:3)", group: "Landscape Ratios" },
                { value: "16:9", label: "Landscape (16:9)", group: "Landscape Ratios" },
                { value: "3:2", label: "Landscape (3:2)", group: "Landscape Ratios" },
                { value: "21:9", label: "Ultrawide (21:9)", group: "Landscape Ratios" },
                { value: "32:9", label: "Super Ultrawide (32:9)", group: "Landscape Ratios" },

                // Portrait Ratios
                { value: "2:3", label: "Portrait (2:3)", group: "Portrait Ratios" },
                { value: "9:16", label: "Portrait (9:16)", group: "Portrait Ratios" },
                { value: "5:7", label: "Portrait (5:7)", group: "Portrait Ratios" },
                { value: "1:2", label: "Portrait (1:2)", group: "Portrait Ratios" },

                // Cinema Ratios
                { value: "2.39:1", label: "Cinemascope (2.39:1)", group: "Cinema Ratios" },
                { value: "1.85:1", label: "Cinema Wide (1.85:1)", group: "Cinema Ratios" },

                // Social Media Ratios
                { value: "4:5", label: "Instagram Portrait (4:5)", group: "Social Media Ratios" },
                { value: "1.91:1", label: "Facebook/Instagram Landscape (1.91:1)", group: "Social Media Ratios" }
              ],
            },
            {
              name: "styleReference",
              label: "Style Reference",
              type: "custom",
              fullWidth: true,
              render: () => (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="styleReference"
                      type="text"
                      value={formData.styleReference}
                      onChange={(e) =>
                        handleInputChange("styleReference", e.target.value)
                      }
                      className="h-10"
                      placeholder="Enter reference number"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="styleReferencerandom"
                      checked={formData.styleReference === "random"}
                      onCheckedChange={(checked) => {
                        handleInputChange(
                          "styleReference",
                          checked ? "random" : ""
                        );
                      }}
                    />
                    <Label htmlFor="styleReferencerandom">Random</Label>
                  </div>
                </div>
              ),
            },
            {
              name: "styleReferenceUrl",
              label: "Reference Image URL",
              type: "text",
            },
            { name: "ignoreWords", label: "Ignore Words", type: "text" },
            { name: "tile", label: "Tile", type: "checkbox" },
            { name: "styleRaw", label: "Style Raw", type: "checkbox" },
          ],
        })}

        <div className="fixed md:w-11/12 w-full lg:max-w-4xl bottom-0 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-t-lg z-50 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.2)]">
          <Label className="font-bold uppercase">Final Prompt</Label>
          <div className="bg-gray-100 p-4 rounded-lg relative mt-2">
            <p className="pr-10 break-words">{generatePrompt()}</p>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromptGenerator;
