"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ClipboardCopy } from "lucide-react";
import Link from "next/link";

export function StructuredPromptGenerator() {
  type FormData = {
    medium: string;
    subject: string;
    environment: string;
    view: string;
    camera: string;
    lens: string;
    lighting: string;
    descriptorI: string;
    descriptorII: string;
    artist: string;
    filmName: string;

    imageUrl: string;
    aspectRatio: string;
    ignoreWords: string;
    tile: boolean;
    styleRaw: boolean;
    styleReference: string;
    styleRandom: boolean;
    timeEpoch: string;
    styleReferenceUrl: string;
    customArtist: boolean;
    customFilm: boolean;
  };

  const [formData, setFormData] = useState<FormData>({
    medium: "",
    subject: "",
    environment: "",
    view: "None",
    camera: "None",
    lens: "None",
    lighting: "None",

    descriptorI: "None",
    descriptorII: "None",
    artist: "",
    filmName: "",

    imageUrl: "",
    aspectRatio: "",
    ignoreWords: "",
    tile: false,
    styleRaw: false,
    styleReference: "",
    styleRandom: false,
    timeEpoch: "None",
    styleReferenceUrl: "",
    customArtist: false,
    customFilm: false,
  });

  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Memoized function to generate prompt
  const generatePrompt = (data: FormData) => {
    let prompt = "";
    let parameters = "";

    // Style Reference URL
    if (data.styleReferenceUrl) {
      prompt = `${data.styleReferenceUrl} `;
    }

    // Basic composition
    if (data.medium || data.subject) {
      prompt += `${data.medium} of ${data.subject}`;
    }

    // Environment
    if (data.environment) {
      prompt += `, ${data.environment}`;
    }

    // Composition
    if (data.view !== "None") prompt += `, ${data.view}`;
    if (data.camera !== "None") prompt += `, ${data.camera}`;
    if (data.lens !== "None") prompt += `, ${data.lens}`;
    if (data.lighting !== "None") prompt += `, ${data.lighting}`;

    // Style
    if (data.descriptorI !== "None") prompt += `, ${data.descriptorI}`;
    if (data.descriptorII !== "None") prompt += `, ${data.descriptorII}`;
    if (data.artist) prompt += `, by ${data.artist}`;
    if (data.filmName) prompt += `, ${data.filmName} film style`;
    if (data.timeEpoch !== "None") prompt += `, Time Period: ${data.timeEpoch}`;

    // Parameters
    if (data.tile) parameters += " --tile";
    if (data.styleRaw) parameters += " --style raw";
    if (data.aspectRatio) parameters += ` --ar ${data.aspectRatio}`;
    if (data.ignoreWords) parameters += ` --no ${data.ignoreWords}`;
    if (data.styleRandom) {
      parameters += " --sref random";
    } else if (data.styleReference) {
      parameters += ` --sref ${data.styleReference}`;
    }

    return prompt + parameters;
  };

  // Simplified input change handler
  const handleInputChange = (field: string, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setShowPrompt(true);
    setGeneratedPrompt(generatePrompt(newData));
  };

  // Memoized copy to clipboard handler
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedPrompt]);

  return (
    <div className="relative min-h-screen w-full pb-40">
      <div className="overflow-y-auto">
        <Card className="w-full max-w-3xl mx-auto mb-32">
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
                . Version 2 - November 2024 -{" "}
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
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* MEDIUM */}
              <div>
                <Label className="font-bold">MEDIUM</Label>
                <CardDescription className="text-sm mb-2">
                  Choose the artistic medium for your image
                </CardDescription>
                <Select
                  value={formData.medium}
                  onValueChange={(value) => handleInputChange("medium", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="pb-2">
                      <SelectLabel>Favorite Mediums</SelectLabel>
                      <SelectItem value="Photograph">Photograph</SelectItem>
                      <SelectItem value="Product Photography">
                        Product Photography
                      </SelectItem>
                      <SelectItem value="Commercial Photography">
                        Commercial Photography
                      </SelectItem>
                      <SelectItem value="Studio Photography">
                        Studio Photography
                      </SelectItem>
                      <SelectItem value="Illustration">Illustration</SelectItem>
                      <SelectItem value="Character design sheet">Character design sheet</SelectItem>
                      <SelectItem value="3D Model">3D Model</SelectItem>


                      <SelectLabel>2D Mediums</SelectLabel>
                      <SelectItem value="Photograph">Photograph</SelectItem>
                      <SelectItem value="Film Still">Film Still</SelectItem>
                      <SelectItem value="Cinematic Portrait">
                        Cinematic Portrait
                      </SelectItem>
                      <SelectItem value="Drawing">Drawing</SelectItem>
                      <SelectItem value="Painting">Painting</SelectItem>
                      <SelectItem value="3D rendering">3D rendering</SelectItem>
                      <SelectItem value="3D Clay Rendered Icon">
                        3D Clay Rendered Icon
                      </SelectItem>
                      <SelectItem value="Animation">Animation</SelectItem>
                      <SelectItem value="Billboard">Billboard</SelectItem>
                      <SelectItem value="Blueprint">Blueprint</SelectItem>
                      <SelectItem value="Risograph">Risograph</SelectItem>
                      <SelectItem value="Brochure">Brochure</SelectItem>
                      <SelectItem value="Calligraphy">Calligraphy</SelectItem>
                      <SelectItem value="Cartoon">Cartoon</SelectItem>
                      <SelectItem value="Collage">Collage</SelectItem>
                      <SelectItem value="Comic book">Comic book</SelectItem>
                      <SelectItem value="Digital art">Digital art</SelectItem>
                      <SelectItem value="Flyer">Flyer</SelectItem>
                      <SelectItem value="Folk Art">Folk Art</SelectItem>
                      <SelectItem value="Icon">Icon</SelectItem>
                      <SelectItem value="Illustration">Illustration</SelectItem>
                      <SelectItem value="Infographic">Infographic</SelectItem>
                      <SelectItem value="Logo">Logo</SelectItem>
                      <SelectItem value="Magazine">Magazine</SelectItem>
                      <SelectItem value="Map">Map</SelectItem>
                      <SelectItem value="Movie poster">Movie poster</SelectItem>
                      <SelectItem value="Pixel art">Pixel art</SelectItem>
                      <SelectItem value="Poster">Poster</SelectItem>
                      <SelectItem value="Vector art">Vector art</SelectItem>
                      <SelectItem value="Wall mural">Wall mural</SelectItem>
                      <SelectItem value="Woodblock print">
                        Woodblock print
                      </SelectItem>
                    </SelectGroup>

                    <SelectGroup className="pb-2">
                      <SelectLabel>Drawing Techniques</SelectLabel>
                      <SelectItem value="Anatomical drawing">
                        Anatomical drawing
                      </SelectItem>
                      <SelectItem value="Anime">Anime</SelectItem>
                      <SelectItem value="Aquarelle">Aquarelle</SelectItem>
                      <SelectItem value="Ballpoint pen drawing">
                        Ballpoint pen drawing
                      </SelectItem>
                      <SelectItem value="Chalk drawing">
                        Chalk drawing
                      </SelectItem>
                      <SelectItem value="Charcoal drawing">
                        Charcoal drawing
                      </SelectItem>
                      <SelectItem value="Colored pencil drawing">
                        Colored pencil drawing
                      </SelectItem>
                      <SelectItem value="Comics">Comics</SelectItem>
                      <SelectItem value="Crosshatch drawing">
                        Crosshatch drawing
                      </SelectItem>
                      <SelectItem value="India ink drawing">
                        India ink drawing
                      </SelectItem>
                      <SelectItem value="Ink drawing">Ink drawing</SelectItem>
                      <SelectItem value="Marker drawing">
                        Marker drawing
                      </SelectItem>
                      <SelectItem value="Pastel drawing">
                        Pastel drawing
                      </SelectItem>
                      <SelectItem value="Pencil drawing">
                        Pencil drawing
                      </SelectItem>
                      <SelectItem value="Pointillism drawing">
                        Pointillism drawing
                      </SelectItem>
                    </SelectGroup>

                    <SelectGroup className="pb-2">
                      <SelectLabel>Painting Techniques</SelectLabel>
                      <SelectItem value="Acrylic painting">
                        Acrylic painting
                      </SelectItem>
                      <SelectItem value="Airbrush painting">
                        Airbrush painting
                      </SelectItem>
                      <SelectItem value="Digital painting">
                        Digital painting
                      </SelectItem>
                      <SelectItem value="Fresco painting">
                        Fresco painting
                      </SelectItem>
                      <SelectItem value="Gouache painting">
                        Gouache painting
                      </SelectItem>
                      <SelectItem value="Graffiti painting">
                        Graffiti painting
                      </SelectItem>
                      <SelectItem value="Oil painting">Oil painting</SelectItem>
                      <SelectItem value="Pastel painting">
                        Pastel painting
                      </SelectItem>
                      <SelectItem value="Watercolor painting">
                        Watercolor painting
                      </SelectItem>
                      <SelectItem value="Street art painting">
                        Street art painting
                      </SelectItem>
                    </SelectGroup>

                    <SelectGroup className="pb-2">
                      <SelectLabel>Photography</SelectLabel>
                      <SelectItem value="35mm film photography">
                        35mm film photography
                      </SelectItem>
                      <SelectItem value="Analog photography">
                        Analog photography
                      </SelectItem>
                      <SelectItem value="Digital photography">
                        Digital photography
                      </SelectItem>
                      <SelectItem value="Infrared photography">
                        Infrared photography
                      </SelectItem>
                      <SelectItem value="Lomography">Lomography</SelectItem>
                      <SelectItem value="Polaroid photography">
                        Polaroid photography
                      </SelectItem>
                      <SelectItem value="Portrait photography">
                        Portrait photography
                      </SelectItem>
                      <SelectItem value="Product photography">
                        Product photography
                      </SelectItem>
                      <SelectItem value="Vintage film photography">
                        Vintage film photography
                      </SelectItem>
                    </SelectGroup>

                    <SelectGroup className="pb-2">
                      <SelectLabel>3D Techniques</SelectLabel>
                      <SelectItem value="3D Model">3D Model</SelectItem>
                      <SelectItem value="Claymation">Claymation</SelectItem>
                      <SelectItem value="Diorama">Diorama</SelectItem>
                      <SelectItem value="Glass sculpture">
                        Glass sculpture
                      </SelectItem>
                      <SelectItem value="Ice sculpture">
                        Ice sculpture
                      </SelectItem>
                      <SelectItem value="Origami">Origami</SelectItem>
                      <SelectItem value="Paper mache sculpture">
                        Paper mache sculpture
                      </SelectItem>
                      <SelectItem value="Pottery">Pottery</SelectItem>
                      <SelectItem value="Sculpture">Sculpture</SelectItem>
                      <SelectItem value="Stained glass">
                        Stained glass
                      </SelectItem>
                    </SelectGroup>

                    <SelectGroup className="pb-2">
                      <SelectLabel>Displays</SelectLabel>
                      <SelectItem value="4k display">4k display</SelectItem>
                      <SelectItem value="CRT display">CRT display</SelectItem>
                      <SelectItem value="Holograph display">
                        Holograph display
                      </SelectItem>
                      <SelectItem value="LCD display">LCD display</SelectItem>
                      <SelectItem value="LED display">LED display</SelectItem>
                      <SelectItem value="OLED display">OLED display</SelectItem>
                      <SelectItem value="Plasma display">
                        Plasma display
                      </SelectItem>
                      <SelectItem value="VHS tape">VHS tape</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* SUBJECT */}
              <div>
                <Label htmlFor="subject" className="font-bold">
                  SUBJECT
                </Label>
                <CardDescription className="text-sm mb-2">
                  Describe the main focus of your image
                </CardDescription>
                <Textarea
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="E.g., A majestic lion, A futuristic cityscape"
                />
              </div>

              <Separator />

              {/* ENVIRONMENT */}
              <div>
                <Label htmlFor="environment" className="font-bold">
                  ENVIRONMENT
                </Label>
                <CardDescription className="text-sm mb-2">
                  Describe the setting or background
                </CardDescription>
                <Textarea
                  id="environment"
                  value={formData.environment}
                  onChange={(e) =>
                    handleInputChange("environment", e.target.value)
                  }
                  placeholder="E.g., lush jungle, bustling marketplace"
                />
              </div>

              <Separator />

              {/* COMPOSITION */}
              <div>
                <Label className="font-bold">COMPOSITION</Label>
                <CardDescription className="text-sm mb-2">
                  Define the visual arrangement and technical aspects
                </CardDescription>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-bold">View</Label>
                    <Select
                      value={formData.view}
                      onValueChange={(value) =>
                        handleInputChange("view", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="pb-2">
                          <SelectLabel>Basic</SelectLabel>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Front view">Front view</SelectItem>
                          <SelectItem value="Back view">Back view</SelectItem>
                          <SelectItem value="Side view">Side view</SelectItem>
                          <SelectItem value="Profile view">Profile view</SelectItem>
                          <SelectItem value="Three-quarter view">Three-quarter view</SelectItem>
                          <SelectItem value="45-degree view">45-degree view</SelectItem>
                          <SelectItem value="Top view">Top view</SelectItem>
                          <SelectItem value="Bottom view">Bottom view</SelectItem>
                          <SelectItem value="Diagonal view">Diagonal view</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Distance</SelectLabel>
                          <SelectItem value="Close-up">Close-up</SelectItem>
                          <SelectItem value="Extreme close-up">Extreme close-up</SelectItem>
                          <SelectItem value="Medium shot">Medium shot</SelectItem>
                          <SelectItem value="Long shot">Long shot</SelectItem>
                          <SelectItem value="Extreme long shot">Extreme long shot</SelectItem>
                          <SelectItem value="Wide angle">Wide angle</SelectItem>
                          <SelectItem value="Ultra wide">Ultra wide</SelectItem>
                          <SelectItem value="Macro">Macro</SelectItem>
                          <SelectItem value="Telephoto">Telephoto</SelectItem>
                          <SelectItem value="Super telephoto">Super telephoto</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Perspective</SelectLabel>
                          <SelectItem value="Aerial view">Aerial view</SelectItem>
                          <SelectItem value="Bird's eye view">Bird&apos;s eye view</SelectItem>
                          <SelectItem value="Worm's eye view">Worm&apos;s eye view</SelectItem>
                          <SelectItem value="First person">First person</SelectItem>
                          <SelectItem value="Third person">Third person</SelectItem>
                          <SelectItem value="Over the shoulder">Over the shoulder</SelectItem>
                          <SelectItem value="Isometric">Isometric</SelectItem>
                          <SelectItem value="Dimetric">Dimetric</SelectItem>
                          <SelectItem value="Low angle">Low angle</SelectItem>
                          <SelectItem value="High angle">High angle</SelectItem>
                          <SelectItem value="Oblique angle">Oblique angle</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Special Effects</SelectLabel>
                          <SelectItem value="Shallow depth of field">Shallow depth of field</SelectItem>
                          <SelectItem value="Deep depth of field">Deep depth of field</SelectItem>
                          <SelectItem value="Dutch angle">Dutch angle</SelectItem>
                          <SelectItem value="Panoramic">Panoramic</SelectItem>
                          <SelectItem value="360-degree">360-degree</SelectItem>
                          <SelectItem value="Fish eye">Fish eye</SelectItem>
                          <SelectItem value="Tilt shift">Tilt shift</SelectItem>
                          <SelectItem value="Double exposure">Double exposure</SelectItem>
                          <SelectItem value="Multiple exposure">Multiple exposure</SelectItem>
                          <SelectItem value="Motion blur">Motion blur</SelectItem>
                          <SelectItem value="Long exposure">Long exposure</SelectItem>
                          <SelectItem value="Time-lapse">Time-lapse</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-bold">Camera</Label>
                    <Select
                      value={formData.camera}
                      onValueChange={(value) =>
                        handleInputChange("camera", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="pb-2">
                          <SelectLabel>Still Cameras</SelectLabel>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Canon EOS R5">
                            Canon EOS R5
                          </SelectItem>
                          <SelectItem value="Sony A7R IV">
                            Sony A7R IV
                          </SelectItem>
                          <SelectItem value="Nikon Z9">Nikon Z9</SelectItem>
                          <SelectItem value="Fujifilm GFX 100S">
                            Fujifilm GFX 100S
                          </SelectItem>
                          <SelectItem value="Hasselblad X2D">
                            Hasselblad X2D
                          </SelectItem>
                          <SelectItem value="Leica M11">Leica M11</SelectItem>
                          <SelectItem value="Phase One IQ4">
                            Phase One IQ4
                          </SelectItem>
                          <SelectItem value="Canon 5D Mark IV">
                            Canon 5D Mark IV
                          </SelectItem>
                          <SelectItem value="Sony A1">Sony A1</SelectItem>
                          <SelectItem value="Nikon D850">Nikon D850</SelectItem>
                          <SelectItem value="Fujifilm X-T4">
                            Fujifilm X-T4
                          </SelectItem>
                          <SelectItem value="Panasonic S1R">
                            Panasonic S1R
                          </SelectItem>
                          <SelectItem value="Olympus OM-1">
                            Olympus OM-1
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Cinema Cameras</SelectLabel>
                          <SelectItem value="RED V-Raptor">
                            RED V-Raptor
                          </SelectItem>
                          <SelectItem value="ARRI Alexa Mini">
                            ARRI Alexa Mini
                          </SelectItem>
                          <SelectItem value="Blackmagic URSA">
                            Blackmagic URSA
                          </SelectItem>
                          <SelectItem value="Canon C70">Canon C70</SelectItem>
                          <SelectItem value="Sony FX9">Sony FX9</SelectItem>
                          <SelectItem value="RED Komodo">RED Komodo</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-bold">Lens</Label>
                    <Select
                      value={formData.lens}
                      onValueChange={(value) =>
                        handleInputChange("lens", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="pb-2">
                          <SelectLabel>Prime Lenses</SelectLabel>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="16mm f/2.8">16mm f/2.8</SelectItem>
                          <SelectItem value="20mm f/1.8">20mm f/1.8</SelectItem>
                          <SelectItem value="24mm f/1.4">24mm f/1.4</SelectItem>
                          <SelectItem value="28mm f/1.8">28mm f/1.8</SelectItem>
                          <SelectItem value="35mm f/1.4">35mm f/1.4</SelectItem>
                          <SelectItem value="40mm f/2">40mm f/2</SelectItem>
                          <SelectItem value="50mm f/1.2">50mm f/1.2</SelectItem>
                          <SelectItem value="85mm f/1.4">85mm f/1.4</SelectItem>
                          <SelectItem value="90mm f/2.8">90mm f/2.8</SelectItem>
                          <SelectItem value="100mm f/2.8 Macro">
                            100mm f/2.8 Macro
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Zoom Lenses</SelectLabel>
                          <SelectItem value="14-24mm f/2.8">
                            14-24mm f/2.8
                          </SelectItem>
                          <SelectItem value="24-70mm f/2.8">
                            24-70mm f/2.8
                          </SelectItem>
                          <SelectItem value="70-200mm f/2.8">
                            70-200mm f/2.8
                          </SelectItem>
                          <SelectItem value="100-400mm f/4.5-5.6">
                            100-400mm f/4.5-5.6
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Super Telephoto</SelectLabel>
                          <SelectItem value="200mm f/2">200mm f/2</SelectItem>
                          <SelectItem value="300mm f/2.8">
                            300mm f/2.8
                          </SelectItem>
                          <SelectItem value="400mm f/2.8">
                            400mm f/2.8
                          </SelectItem>
                          <SelectItem value="600mm f/4">600mm f/4</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-bold">Lighting</Label>
                    <Select
                      value={formData.lighting}
                      onValueChange={(value) =>
                        handleInputChange("lighting", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectGroup className="pb-2">
                          <SelectLabel>Favorite Lighting</SelectLabel>
                          <SelectItem value="Studio lighting">Studio lighting</SelectItem>
                          <SelectItem value="Natural daylight">Natural daylight</SelectItem>
                          <SelectItem value="Golden hour sunlight">Golden hour sunlight</SelectItem>
                          <SelectItem value="Soft lighting">Soft lighting</SelectItem>
                          <SelectItem value="Dramatic lighting">Dramatic lighting</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Natural Lighting</SelectLabel>
                          <SelectItem value="Daylight">Daylight</SelectItem>
                          <SelectItem value="Golden hour sunlight">
                            Golden hour sunlight
                          </SelectItem>
                          <SelectItem value="Morning light">
                            Morning light
                          </SelectItem>
                          <SelectItem value="Twilight lighting">
                            Twilight lighting
                          </SelectItem>
                          <SelectItem value="Moonlight">Moonlight</SelectItem>
                          <SelectItem value="Bioluminescence">
                            Bioluminescence
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Indoor Artificial Lighting</SelectLabel>
                          <SelectItem value="Incandescent lighting">
                            Incandescent lighting
                          </SelectItem>
                          <SelectItem value="Fluorescent lighting">
                            Fluorescent lighting
                          </SelectItem>
                          <SelectItem value="Neon lighting">
                            Neon lighting
                          </SelectItem>
                          <SelectItem value="LED lights">LED lights</SelectItem>
                          <SelectItem value="Backlighting">
                            Backlighting
                          </SelectItem>
                          <SelectItem value="Overhead lighting">
                            Overhead lighting
                          </SelectItem>
                          <SelectItem value="Wall sconce light">
                            Wall sconce light
                          </SelectItem>
                          <SelectItem value="Pendant light">
                            Pendant light
                          </SelectItem>
                          <SelectItem value="Night light">
                            Night light
                          </SelectItem>
                          <SelectItem value="Candle light">
                            Candle light
                          </SelectItem>
                          <SelectItem value="Firelight">Firelight</SelectItem>
                          <SelectItem value="Edison bulb">
                            Edison bulb
                          </SelectItem>
                          <SelectItem value="Vacuum tube bulb">
                            Vacuum tube bulb
                          </SelectItem>
                          <SelectItem value="Nixie tube bulb">
                            Nixie tube bulb
                          </SelectItem>
                          <SelectItem value="Christmas lights">
                            Christmas lights
                          </SelectItem>
                          <SelectItem value="Party lighting">
                            Party lighting
                          </SelectItem>
                          <SelectItem value="Black light">
                            Black light
                          </SelectItem>
                          <SelectItem value="UV light">UV light</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Outdoor Artificial Lighting</SelectLabel>
                          <SelectItem value="Street light">
                            Street light
                          </SelectItem>
                          <SelectItem value="Porch light">
                            Porch light
                          </SelectItem>
                          <SelectItem value="Security light">
                            Security light
                          </SelectItem>
                          <SelectItem value="Floodlight">Floodlight</SelectItem>
                          <SelectItem value="Car headlight">
                            Car headlight
                          </SelectItem>
                          <SelectItem value="Warning light">
                            Warning light
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>
                            Theatrical/Cinematic Lighting
                          </SelectLabel>
                          <SelectItem value="Cinematic lighting">
                            Cinematic lighting
                          </SelectItem>
                          <SelectItem value="Dramatic lighting">
                            Dramatic lighting
                          </SelectItem>
                          <SelectItem value="Film noir lighting">
                            Film noir lighting
                          </SelectItem>
                          <SelectItem value="Key lighting">
                            Key lighting
                          </SelectItem>
                          <SelectItem value="Fill lighting">
                            Fill lighting
                          </SelectItem>
                          <SelectItem value="Backlight">Backlight</SelectItem>
                          <SelectItem value="Rim lighting">
                            Rim lighting
                          </SelectItem>
                          <SelectItem value="Cross lighting">
                            Cross lighting
                          </SelectItem>
                          <SelectItem value="Spot lighting">
                            Spot lighting
                          </SelectItem>
                          <SelectItem value="Studio lighting">
                            Studio lighting
                          </SelectItem>
                          <SelectItem value="Contre-jour lighting">
                            Contre-jour lighting
                          </SelectItem>
                          <SelectItem value="Silhouette lighting">
                            Silhouette lighting
                          </SelectItem>
                          <SelectItem value="Volumetric lighting">
                            Volumetric lighting
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Lighting Qualities</SelectLabel>
                          <SelectItem value="Soft lighting">
                            Soft lighting
                          </SelectItem>
                          <SelectItem value="Hard lighting">
                            Hard lighting
                          </SelectItem>
                          <SelectItem value="Diffused lighting">
                            Diffused lighting
                          </SelectItem>
                          <SelectItem value="Ambient lighting">
                            Ambient lighting
                          </SelectItem>
                          <SelectItem value="Bright lighting">
                            Bright lighting
                          </SelectItem>
                          <SelectItem value="Bright-dark contrast lighting">
                            Bright-dark contrast lighting
                          </SelectItem>
                          <SelectItem value="Dark lighting">
                            Dark lighting
                          </SelectItem>
                          <SelectItem value="Low-key lighting">
                            Low-key lighting
                          </SelectItem>
                          <SelectItem value="High-key lighting">
                            High-key lighting
                          </SelectItem>
                          <SelectItem value="Moody lighting">
                            Moody lighting
                          </SelectItem>
                          <SelectItem value="Hazy lighting">
                            Hazy lighting
                          </SelectItem>
                          <SelectItem value="Colorful lighting">
                            Colorful lighting
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Lighting Effects</SelectLabel>
                          <SelectItem value="Lens flare">Lens flare</SelectItem>
                          <SelectItem value="Light rays">Light rays</SelectItem>
                          <SelectItem value="Crepuscular rays">
                            Crepuscular rays
                          </SelectItem>
                          <SelectItem value="Glow in the dark light">
                            Glow in the dark light
                          </SelectItem>
                          <SelectItem value="Glow stick">Glow stick</SelectItem>
                          <SelectItem value="Glowing light">
                            Glowing light
                          </SelectItem>
                          <SelectItem value="Flickering light">
                            Flickering light
                          </SelectItem>
                          <SelectItem value="Laser light">
                            Laser light
                          </SelectItem>
                          <SelectItem value="Infrared light">
                            Infrared light
                          </SelectItem>
                          <SelectItem value="X-ray">X-ray</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Other Sources</SelectLabel>
                          <SelectItem value="Campfire lighting">
                            Campfire lighting
                          </SelectItem>
                          <SelectItem value="Candlelight">
                            Candlelight
                          </SelectItem>
                          <SelectItem value="Oil lamp">Oil lamp</SelectItem>
                          <SelectItem value="Plasma globe">
                            Plasma globe
                          </SelectItem>
                          <SelectItem value="Lantern light">
                            Lantern light
                          </SelectItem>
                          <SelectItem value="Torch light">
                            Torch light
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* STYLE */}
              <div>
                <Label className="font-bold">STYLE</Label>
                <CardDescription className="text-sm mb-2">
                  Define the artistic style and mood
                </CardDescription>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-bold">Emotion / Mood</Label>
                    <Select
                      value={formData.descriptorI}
                      onValueChange={(value) =>
                        handleInputChange("descriptorI", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="pb-2">
                          <SelectLabel>Basic Emotions</SelectLabel>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Happy">Happy</SelectItem>
                          <SelectItem value="Sad">Sad</SelectItem>
                          <SelectItem value="Angry">Angry</SelectItem>
                          <SelectItem value="Fearful">Fearful</SelectItem>
                          <SelectItem value="Surprised">Surprised</SelectItem>
                          <SelectItem value="Disgusted">Disgusted</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Positive Moods</SelectLabel>
                          <SelectItem value="Joyful">Joyful</SelectItem>
                          <SelectItem value="Excited">Excited</SelectItem>
                          <SelectItem value="Peaceful">Peaceful</SelectItem>
                          <SelectItem value="Serene">Serene</SelectItem>
                          <SelectItem value="Content">Content</SelectItem>
                          <SelectItem value="Optimistic">Optimistic</SelectItem>
                          <SelectItem value="Playful">Playful</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Negative Moods</SelectLabel>
                          <SelectItem value="Melancholic">Melancholic</SelectItem>
                          <SelectItem value="Gloomy">Gloomy</SelectItem>
                          <SelectItem value="Anxious">Anxious</SelectItem>
                          <SelectItem value="Depressed">Depressed</SelectItem>
                          <SelectItem value="Frustrated">Frustrated</SelectItem>
                          <SelectItem value="Lonely">Lonely</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Complex Moods</SelectLabel>
                          <SelectItem value="Nostalgic">Nostalgic</SelectItem>
                          <SelectItem value="Mysterious">Mysterious</SelectItem>
                          <SelectItem value="Contemplative">Contemplative</SelectItem>
                          <SelectItem value="Bittersweet">Bittersweet</SelectItem>
                          <SelectItem value="Ambivalent">Ambivalent</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Atmospheric Moods</SelectLabel>
                          <SelectItem value="Ethereal">Ethereal</SelectItem>
                          <SelectItem value="Dramatic">Dramatic</SelectItem>
                          <SelectItem value="Mystical">Mystical</SelectItem>
                          <SelectItem value="Whimsical">Whimsical</SelectItem>
                          <SelectItem value="Chaotic">Chaotic</SelectItem>
                          <SelectItem value="Tranquil">Tranquil</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Energetic States</SelectLabel>
                          <SelectItem value="Vibrant">Vibrant</SelectItem>
                          <SelectItem value="Energetic">Energetic</SelectItem>
                          <SelectItem value="Dynamic">Dynamic</SelectItem>
                          <SelectItem value="Bold">Bold</SelectItem>
                          <SelectItem value="Intense">Intense</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-bold">Art Movement</Label>
                    <Select
                      value={formData.descriptorII}
                      onValueChange={(value) =>
                        handleInputChange("descriptorII", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="pb-2">
                          <SelectLabel>Art Movements</SelectLabel>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Art Deco">Art Deco</SelectItem>
                          <SelectItem value="Art Nouveau">
                            Art Nouveau
                          </SelectItem>
                          <SelectItem value="Baroque">Baroque</SelectItem>
                          <SelectItem value="Bauhaus">Bauhaus</SelectItem>
                          <SelectItem value="Cubism">Cubism</SelectItem>
                          <SelectItem value="Expressionism">
                            Expressionism
                          </SelectItem>
                          <SelectItem value="Impressionism">
                            Impressionism
                          </SelectItem>
                          <SelectItem value="Minimalism">Minimalism</SelectItem>
                          <SelectItem value="Pop Art">Pop Art</SelectItem>
                          <SelectItem value="Surrealism">Surrealism</SelectItem>
                          <SelectItem value="Street Art">Street Art</SelectItem>
                          <SelectItem value="Ukiyo-e">Ukiyo-e</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Label className="font-bold">Artist</Label>
                      <Checkbox
                        id="customArtist"
                        checked={formData.customArtist}
                        onCheckedChange={(checked) =>
                          handleInputChange("customArtist", checked as boolean)
                        }
                      />
                      <Label htmlFor="customArtist" className="text-sm">
                        Custom
                      </Label>
                    </div>
                    {formData.customArtist ? (
                      <Input
                        value={formData.artist}
                        onChange={(e) =>
                          handleInputChange("artist", e.target.value)
                        }
                        placeholder="Enter custom artist name"
                      />
                    ) : (
                      <Select
                        value={formData.artist}
                        onValueChange={(value) =>
                          handleInputChange("artist", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="pb-2">
                            <SelectLabel>None</SelectLabel>
                            <SelectItem value="None">None</SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Renaissance & Baroque</SelectLabel>
                            <SelectItem value="Leonardo da Vinci">
                              Leonardo da Vinci
                            </SelectItem>
                            <SelectItem value="Michelangelo">
                              Michelangelo
                            </SelectItem>
                            <SelectItem value="Artemisia Gentileschi">
                              Artemisia Gentileschi
                            </SelectItem>
                            <SelectItem value="Rembrandt">Rembrandt</SelectItem>
                            <SelectItem value="Caravaggio">
                              Caravaggio
                            </SelectItem>
                            <SelectItem value="Johannes Vermeer">
                              Johannes Vermeer
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>
                              Impressionism & Post-Impressionism
                            </SelectLabel>
                            <SelectItem value="Claude Monet">
                              Claude Monet
                            </SelectItem>
                            <SelectItem value="Vincent van Gogh">
                              Vincent van Gogh
                            </SelectItem>
                            <SelectItem value="Mary Cassatt">
                              Mary Cassatt
                            </SelectItem>
                            <SelectItem value="Berthe Morisot">
                              Berthe Morisot
                            </SelectItem>
                            <SelectItem value="Edgar Degas">
                              Edgar Degas
                            </SelectItem>
                            <SelectItem value="Paul Cézanne">
                              Paul Cézanne
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Modern Art</SelectLabel>
                            <SelectItem value="Frida Kahlo">
                              Frida Kahlo
                            </SelectItem>
                            <SelectItem value="Georgia O'Keeffe">
                              Georgia O&apos;Keeffe
                            </SelectItem>
                            <SelectItem value="Pablo Picasso">
                              Pablo Picasso
                            </SelectItem>
                            <SelectItem value="Salvador Dalí">
                              Salvador Dalí
                            </SelectItem>
                            <SelectItem value="Wassily Kandinsky">
                              Wassily Kandinsky
                            </SelectItem>
                            <SelectItem value="Henri Matisse">
                              Henri Matisse
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Contemporary Masters</SelectLabel>
                            <SelectItem value="Marina Abramović">
                              Marina Abramović
                            </SelectItem>
                            <SelectItem value="Yayoi Kusama">
                              Yayoi Kusama
                            </SelectItem>
                            <SelectItem value="Ai Weiwei">Ai Weiwei</SelectItem>
                            <SelectItem value="Jeff Koons">
                              Jeff Koons
                            </SelectItem>
                            <SelectItem value="Cindy Sherman">
                              Cindy Sherman
                            </SelectItem>
                            <SelectItem value="Kehinde Wiley">
                              Kehinde Wiley
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Photography</SelectLabel>
                            <SelectItem value="Annie Leibovitz">
                              Annie Leibovitz
                            </SelectItem>
                            <SelectItem value="Dorothea Lange">
                              Dorothea Lange
                            </SelectItem>
                            <SelectItem value="Ansel Adams">
                              Ansel Adams
                            </SelectItem>
                            <SelectItem value="Vivian Maier">
                              Vivian Maier
                            </SelectItem>
                            <SelectItem value="Henri Cartier-Bresson">
                              Henri Cartier-Bresson
                            </SelectItem>
                            <SelectItem value="Diane Arbus">
                              Diane Arbus
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Digital & Concept Artists</SelectLabel>
                            <SelectItem value="Beeple">Beeple</SelectItem>
                            <SelectItem value="Simon Stålenhag">
                              Simon Stålenhag
                            </SelectItem>
                            <SelectItem value="Julie Bell">
                              Julie Bell
                            </SelectItem>
                            <SelectItem value="James Jean">
                              James Jean
                            </SelectItem>
                            <SelectItem value="Artgerm">Artgerm</SelectItem>
                            <SelectItem value="Ross Tran">Ross Tran</SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Street Art</SelectLabel>
                            <SelectItem value="Banksy">Banksy</SelectItem>
                            <SelectItem value="Jean-Michel Basquiat">
                              Jean-Michel Basquiat
                            </SelectItem>
                            <SelectItem value="Lady Pink">Lady Pink</SelectItem>
                            <SelectItem value="KAWS">KAWS</SelectItem>
                            <SelectItem value="Shepard Fairey">
                              Shepard Fairey
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Illustrators</SelectLabel>
                            <SelectItem value="Hayao Miyazaki">
                              Hayao Miyazaki
                            </SelectItem>
                            <SelectItem value="Tove Jansson">
                              Tove Jansson
                            </SelectItem>
                            <SelectItem value="Maurice Sendak">
                              Maurice Sendak
                            </SelectItem>
                            <SelectItem value="Beatrix Potter">
                              Beatrix Potter
                            </SelectItem>
                            <SelectItem value="Norman Rockwell">
                              Norman Rockwell
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Label className="font-bold">Film Style</Label>
                      <Checkbox
                        id="customFilm"
                        checked={formData.customFilm}
                        onCheckedChange={(checked) =>
                          handleInputChange("customFilm", checked as boolean)
                        }
                      />
                      <Label htmlFor="customFilm" className="text-sm">
                        Custom
                      </Label>
                    </div>
                    {formData.customFilm ? (
                      <Input
                        value={formData.filmName}
                        onChange={(e) =>
                          handleInputChange("filmName", e.target.value)
                        }
                        placeholder="Enter custom film name"
                      />
                    ) : (
                      <Select
                        value={formData.filmName}
                        onValueChange={(value) =>
                          handleInputChange("filmName", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="pb-2">
                            <SelectLabel>None</SelectLabel>
                            <SelectItem value="None">None</SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Film Noir</SelectLabel>
                            <SelectItem value="The Maltese Falcon">
                              The Maltese Falcon
                            </SelectItem>
                            <SelectItem value="Double Indemnity">
                              Double Indemnity
                            </SelectItem>
                            <SelectItem value="Blade Runner">
                              Blade Runner
                            </SelectItem>
                            <SelectItem value="Sin City">Sin City</SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Science Fiction</SelectLabel>
                            <SelectItem value="2001: A Space Odyssey">
                              2001: A Space Odyssey
                            </SelectItem>
                            <SelectItem value="The Matrix">
                              The Matrix
                            </SelectItem>
                            <SelectItem value="Alien">Alien</SelectItem>
                            <SelectItem value="Metropolis">
                              Metropolis
                            </SelectItem>
                            <SelectItem value="Dune">Dune</SelectItem>
                            <SelectItem value="Tron">Tron</SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Horror</SelectLabel>
                            <SelectItem value="The Shining">
                              The Shining
                            </SelectItem>
                            <SelectItem value="Nosferatu">Nosferatu</SelectItem>
                            <SelectItem value="A Nightmare on Elm Street">
                              A Nightmare on Elm Street
                            </SelectItem>
                            <SelectItem value="The Cabinet of Dr. Caligari">
                              The Cabinet of Dr. Caligari
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Fantasy</SelectLabel>
                            <SelectItem value="Pan's Labyrinth">
                              Pan&apos;s Labyrinth
                            </SelectItem>
                            <SelectItem value="The Lord of the Rings">
                              The Lord of the Rings
                            </SelectItem>
                            <SelectItem value="The Dark Crystal">
                              The Dark Crystal
                            </SelectItem>
                            <SelectItem value="The NeverEnding Story">
                              The NeverEnding Story
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Western</SelectLabel>
                            <SelectItem value="The Good, the Bad and the Ugly">
                              The Good, the Bad and the Ugly
                            </SelectItem>
                            <SelectItem value="Once Upon a Time in the West">
                              Once Upon a Time in the West
                            </SelectItem>
                            <SelectItem value="Django Unchained">
                              Django Unchained
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Drama</SelectLabel>
                            <SelectItem value="Citizen Kane">
                              Citizen Kane
                            </SelectItem>
                            <SelectItem value="The Godfather">
                              The Godfather
                            </SelectItem>
                            <SelectItem value="Schindler's List">
                              Schindler&apos;s List
                            </SelectItem>
                            <SelectItem value="Lawrence of Arabia">
                              Lawrence of Arabia
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>French New Wave</SelectLabel>
                            <SelectItem value="Breathless">
                              Breathless
                            </SelectItem>
                            <SelectItem value="The 400 Blows">
                              The 400 Blows
                            </SelectItem>
                            <SelectItem value="Jules and Jim">
                              Jules and Jim
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>German Expressionism</SelectLabel>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="The Cabinet of Dr. Caligari">
                              The Cabinet of Dr. Caligari
                            </SelectItem>
                            <SelectItem value="Metropolis">
                              Metropolis
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Japanese Cinema</SelectLabel>
                            <SelectItem value="Seven Samurai">
                              Seven Samurai
                            </SelectItem>
                            <SelectItem value="Rashomon">Rashomon</SelectItem>
                            <SelectItem value="Spirited Away">
                              Spirited Away
                            </SelectItem>
                            <SelectItem value="Akira">Akira</SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Contemporary</SelectLabel>
                            <SelectItem value="Inception">Inception</SelectItem>
                            <SelectItem value="Grand Budapest Hotel">
                              Grand Budapest Hotel
                            </SelectItem>
                            <SelectItem value="La La Land">
                              La La Land
                            </SelectItem>
                            <SelectItem value="Mad Max: Fury Road">
                              Mad Max: Fury Road
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup className="pb-2">
                            <SelectLabel>Experimental</SelectLabel>
                            <SelectItem value="Un Chien Andalou">
                              Un Chien Andalou
                            </SelectItem>
                            <SelectItem value="Eraserhead">
                              Eraserhead
                            </SelectItem>
                            <SelectItem value="The Holy Mountain">
                              The Holy Mountain
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label className="font-bold">Time Epoch</Label>
                    <Select
                      value={formData.timeEpoch}
                      onValueChange={(value) =>
                        handleInputChange("timeEpoch", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Choose Epoch</SelectLabel>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Ancient">
                            Ancient (3000 BCE - 500 CE)
                          </SelectItem>
                          <SelectItem value="Medieval">
                            Medieval (500-1400)
                          </SelectItem>
                          <SelectItem value="Renaissance">
                            Renaissance (1400-1600)
                          </SelectItem>
                          <SelectItem value="Baroque">
                            Baroque (1600-1750)
                          </SelectItem>
                          <SelectItem value="Enlightenment">
                            Enlightenment (1700-1800)
                          </SelectItem>
                          <SelectItem value="Victorian">
                            Victorian (1837-1901)
                          </SelectItem>
                          <SelectItem value="Modern">
                            Modern (1901-1945)
                          </SelectItem>
                          <SelectItem value="Post-Modern">
                            Post-Modern (1945-2000)
                          </SelectItem>
                          <SelectItem value="Contemporary">
                            Contemporary (2000-Present)
                          </SelectItem>
                          <SelectItem value="Futuristic">Futuristic</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="styleReference" className="font-bold">
                        Style Reference
                      </Label>
                      <Checkbox
                        id="styleRandom"
                        checked={formData.styleRandom}
                        onCheckedChange={(checked) =>
                          handleInputChange("styleRandom", checked as boolean)
                        }
                      />
                      <Label htmlFor="styleRandom" className="text-sm">
                        Random
                      </Label>
                    </div>
                    <Input
                      id="styleReference"
                      type="number"
                      value={formData.styleReference}
                      onChange={(e) =>
                        handleInputChange("styleReference", e.target.value)
                      }
                      placeholder="Enter reference number"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="styleReferenceUrl" className="font-bold">
                    Image Reference URL
                  </Label>
                  <Input
                    id="styleReferenceUrl"
                    value={formData.styleReferenceUrl}
                    onChange={(e) =>
                      handleInputChange("styleReferenceUrl", e.target.value)
                    }
                    placeholder="Enter URL for style reference"
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              {/* Additional Parameters */}
              <div>
                <Label className="font-bold uppercase">
                  Additional Parameters
                </Label>
                <CardDescription className="text-sm mb-2">
                  Define additional parameters for your image
                </CardDescription>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-bold">Aspect Ratio</Label>
                    <Select
                      value={formData.aspectRatio}
                      onValueChange={(value) =>
                        handleInputChange("aspectRatio", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectGroup className="pb-2">
                          <SelectLabel>Default</SelectLabel>
                          <SelectItem value="None">None</SelectItem>
                        </SelectGroup> */}

                        <SelectGroup className="pb-2">
                          <SelectLabel>Square</SelectLabel>
                          <SelectItem value="1:1">1:1</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Landscape</SelectLabel>
                          <SelectItem value="4:3">4:3</SelectItem>
                          <SelectItem value="16:9">16:9</SelectItem>
                          <SelectItem value="3:2">3:2</SelectItem>
                        </SelectGroup>

                        <SelectGroup className="pb-2">
                          <SelectLabel>Portrait</SelectLabel>
                          <SelectItem value="2:3">2:3</SelectItem>
                          <SelectItem value="9:16">9:16</SelectItem>
                          <SelectItem value="5:7">5:7</SelectItem>
                          <SelectItem value="1:2">1:2</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ignoreWords" className="font-bold">
                      Ignore Words
                    </Label>
                    <Input
                      id="ignoreWords"
                      value={formData.ignoreWords}
                      onChange={(e) =>
                        handleInputChange("ignoreWords", e.target.value)
                      }
                      placeholder="E.g., blur, text"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tile"
                      checked={formData.tile}
                      onCheckedChange={(checked) =>
                        handleInputChange("tile", checked as boolean)
                      }
                    />
                    <Label htmlFor="tile" className="font-bold">
                      Tile
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="styleRaw"
                      checked={formData.styleRaw}
                      onCheckedChange={(checked) =>
                        handleInputChange("styleRaw", checked as boolean)
                      }
                    />
                    <Label htmlFor="styleRaw" className="font-bold">
                      Style Raw
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showPrompt && (
        <div className="fixed md:w-11/12 w-full lg:max-w-4xl bottom-0 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-t-lg z-50 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.2)]">
          {/* <div className="mx-auto mb-4 h-1.5 w-[100px] rounded-full bg-gray-300" > */}
          <Label className="font-bold uppercase">Final Prompt</Label>
          <Textarea
            value={generatedPrompt}
            onChange={(e) => setGeneratedPrompt(e.target.value)}
            className="min-h-[120px] mt-2"
          />
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white hover:text-white"
          >
            <ClipboardCopy className="w-4 h-4 mr-2" />
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
      )}
    </div>
  );
}
