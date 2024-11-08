"use client";

import { useState } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCopy } from "lucide-react";

export function PromptGenerator() {
  const [formData, setFormData] = useState({
    subject: "",
    imageUrl: "",
    aspectRatio: "1:1",
    medium: "None",
    view: "None",
    camera: "None",
    lens: "None",
    film: "None",
    lighting: "None",
    backgroundColor: "None",
    descriptorI: "None",
    descriptorII: "None",
    artist: "",
    filmName: "",
    styleReference: "",
    styleRandom: false,
    ignoreWords: "",
    tile: false,
    styleRaw: false,
  });

  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Add new state for copy status
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generatePrompt = () => {
    let prompt = "";

    // Start with Medium and subject
    if (formData.medium !== "None") {
      prompt = `${formData.medium} of ${formData.subject}`;
    } else {
      prompt = formData.subject;
    }

    // Add artist if present
    if (formData.artist) prompt += ` , by ${formData.artist}`;

    // Add view, camera, lens
    if (formData.view !== "None") prompt += ` , View: ${formData.view}`;
    if (formData.camera !== "None") prompt += ` , Camera: ${formData.camera}`;
    if (formData.lens !== "None") prompt += ` , Lens: ${formData.lens}`;

    // Add film type
    if (formData.film !== "None") prompt += ` , ${formData.film}`;

    // Add descriptors
    if (formData.descriptorI !== "None") prompt += ` , ${formData.descriptorI}`;
    if (formData.descriptorII !== "None")
      prompt += ` , ${formData.descriptorII}`;

    // Add lighting
    if (formData.lighting !== "None") prompt += ` , ${formData.lighting}`;

    // Add film style
    if (formData.filmName) prompt += ` , ${formData.filmName} film style`;

    // Add flags at the end
    if (formData.tile) prompt += " --tile";
    if (formData.styleRaw) prompt += " --style raw";
    if (formData.aspectRatio !== "None")
      prompt += ` --ar ${formData.aspectRatio}`;
    if (formData.ignoreWords) prompt += ` --no ${formData.ignoreWords}`;
    if (formData.imageUrl) prompt += ` --sref ${formData.imageUrl}`;
    if (formData.styleRandom) prompt += " --sref random";
    else if (formData.styleReference)
      prompt += ` --sref ${formData.styleReference}`;

    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-normal text-gray-600">
          Midjourney Prompt Generator v2.0{" "}
        </CardTitle>
        <CardDescription>
          A handy tool for generating advanced prompts in Midjourney
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject Description</Label>
            <Textarea
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Enter subject description"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Include Image-URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="Reference Image URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Aspect Ratio</Label>
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
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="1:1">1:1</SelectItem>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectItem value="3:2">3:2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Medium</Label>
              <Select
                value={formData.medium}
                onValueChange={(value) => handleInputChange("medium", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Cinematic Portrait">
                    Cinematic Portrait
                  </SelectItem>
                  <SelectItem value="Digital Art">Digital Art</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Oil Painting">Oil Painting</SelectItem>
                  <SelectItem value="Watercolor">Watercolor</SelectItem>
                  <SelectItem value="Pencil Sketch">Pencil Sketch</SelectItem>
                  <SelectItem value="3D Render">3D Render</SelectItem>
                  <SelectItem value="Pixel Art">Pixel Art</SelectItem>
                  <SelectItem value="Vector Art">Vector Art</SelectItem>
                  <SelectItem value="Comic Style">Comic Style</SelectItem>
                  <SelectItem value="Concept Art">Concept Art</SelectItem>
                  <SelectItem value="Character Design">
                    Character Design
                  </SelectItem>
                  <SelectItem value="Fantasy Art">Fantasy Art</SelectItem>
                  <SelectItem value="Sci-fi Art">Sci-fi Art</SelectItem>
                  <SelectItem value="Abstract Art">Abstract Art</SelectItem>
                  <SelectItem value="Minimalist">Minimalist</SelectItem>
                  <SelectItem value="Surrealism">Surrealism</SelectItem>
                  <SelectItem value="Pop Art">Pop Art</SelectItem>
                  <SelectItem value="Impressionism">Impressionism</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>View</Label>
              <Select
                value={formData.view}
                onValueChange={(value) => handleInputChange("view", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Shallow depth of field">
                    Shallow depth of field
                  </SelectItem>
                  <SelectItem value="Wide angle">Wide angle</SelectItem>
                  <SelectItem value="Close-up">Close-up</SelectItem>
                  <SelectItem value="Aerial view">Aerial view</SelectItem>
                  <SelectItem value="Bird's eye view">
                    Bird's eye view
                  </SelectItem>
                  <SelectItem value="Worm's eye view">
                    Worm's eye view
                  </SelectItem>
                  <SelectItem value="Panoramic">Panoramic</SelectItem>
                  <SelectItem value="First person">First person</SelectItem>
                  <SelectItem value="Third person">Third person</SelectItem>
                  <SelectItem value="Over the shoulder">
                    Over the shoulder
                  </SelectItem>
                  <SelectItem value="Profile view">Profile view</SelectItem>
                  <SelectItem value="Front view">Front view</SelectItem>
                  <SelectItem value="Back view">Back view</SelectItem>
                  <SelectItem value="Three-quarter view">
                    Three-quarter view
                  </SelectItem>
                  <SelectItem value="Isometric">Isometric</SelectItem>
                  <SelectItem value="Macro">Macro</SelectItem>
                  <SelectItem value="Telephoto">Telephoto</SelectItem>
                  <SelectItem value="Fish eye">Fish eye</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Camera</Label>
              <Select
                value={formData.camera}
                onValueChange={(value) => handleInputChange("camera", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Canon EOS R5">Canon EOS R5</SelectItem>
                  <SelectItem value="Sony A7R IV">Sony A7R IV</SelectItem>
                  <SelectItem value="Nikon Z9">Nikon Z9</SelectItem>
                  <SelectItem value="Fujifilm GFX 100S">
                    Fujifilm GFX 100S
                  </SelectItem>
                  <SelectItem value="Hasselblad X2D">Hasselblad X2D</SelectItem>
                  <SelectItem value="Leica M11">Leica M11</SelectItem>
                  <SelectItem value="Phase One IQ4">Phase One IQ4</SelectItem>
                  <SelectItem value="Canon 5D Mark IV">
                    Canon 5D Mark IV
                  </SelectItem>
                  <SelectItem value="Sony A1">Sony A1</SelectItem>
                  <SelectItem value="Nikon D850">Nikon D850</SelectItem>
                  <SelectItem value="Fujifilm X-T4">Fujifilm X-T4</SelectItem>
                  <SelectItem value="Panasonic S1R">Panasonic S1R</SelectItem>
                  <SelectItem value="Olympus OM-1">Olympus OM-1</SelectItem>
                  <SelectItem value="RED V-Raptor">RED V-Raptor</SelectItem>
                  <SelectItem value="ARRI Alexa Mini">
                    ARRI Alexa Mini
                  </SelectItem>
                  <SelectItem value="Blackmagic URSA">
                    Blackmagic URSA
                  </SelectItem>
                  <SelectItem value="Canon C70">Canon C70</SelectItem>
                  <SelectItem value="Sony FX9">Sony FX9</SelectItem>
                  <SelectItem value="RED Komodo">RED Komodo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lens</Label>
              <Select
                value={formData.lens}
                onValueChange={(value) => handleInputChange("lens", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="24mm f/1.4">24mm f/1.4</SelectItem>
                  <SelectItem value="35mm f/1.4">35mm f/1.4</SelectItem>
                  <SelectItem value="50mm f/1.2">50mm f/1.2</SelectItem>
                  <SelectItem value="85mm f/1.4">85mm f/1.4</SelectItem>
                  <SelectItem value="135mm f/1.8">135mm f/1.8</SelectItem>
                  <SelectItem value="14-24mm f/2.8">14-24mm f/2.8</SelectItem>
                  <SelectItem value="24-70mm f/2.8">24-70mm f/2.8</SelectItem>
                  <SelectItem value="70-200mm f/2.8">70-200mm f/2.8</SelectItem>
                  <SelectItem value="100-400mm f/4.5-5.6">
                    100-400mm f/4.5-5.6
                  </SelectItem>
                  <SelectItem value="16mm f/2.8">16mm f/2.8</SelectItem>
                  <SelectItem value="20mm f/1.8">20mm f/1.8</SelectItem>
                  <SelectItem value="28mm f/1.8">28mm f/1.8</SelectItem>
                  <SelectItem value="40mm f/2">40mm f/2</SelectItem>
                  <SelectItem value="90mm f/2.8">90mm f/2.8</SelectItem>
                  <SelectItem value="100mm f/2.8 Macro">
                    100mm f/2.8 Macro
                  </SelectItem>
                  <SelectItem value="200mm f/2">200mm f/2</SelectItem>
                  <SelectItem value="300mm f/2.8">300mm f/2.8</SelectItem>
                  <SelectItem value="400mm f/2.8">400mm f/2.8</SelectItem>
                  <SelectItem value="600mm f/4">600mm f/4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Film</Label>
              <Select
                value={formData.film}
                onValueChange={(value) => handleInputChange("film", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Kodak Portra 400">
                    Kodak Portra 400
                  </SelectItem>
                  <SelectItem value="Fujifilm Pro 400H">
                    Fujifilm Pro 400H
                  </SelectItem>
                  <SelectItem value="Kodak Tri-X">Kodak Tri-X</SelectItem>
                  <SelectItem value="Ilford HP5">Ilford HP5</SelectItem>
                  <SelectItem value="Kodak Ektar 100">
                    Kodak Ektar 100
                  </SelectItem>
                  <SelectItem value="Fujifilm Velvia 50">
                    Fujifilm Velvia 50
                  </SelectItem>
                  <SelectItem value="Kodak Gold 200">Kodak Gold 200</SelectItem>
                  <SelectItem value="Ilford Delta 3200">
                    Ilford Delta 3200
                  </SelectItem>
                  <SelectItem value="Kodak T-Max 400">
                    Kodak T-Max 400
                  </SelectItem>
                  <SelectItem value="Fujifilm Provia 100F">
                    Fujifilm Provia 100F
                  </SelectItem>
                  <SelectItem value="Kodak Ektachrome E100">
                    Kodak Ektachrome E100
                  </SelectItem>
                  <SelectItem value="Ilford FP4 Plus">
                    Ilford FP4 Plus
                  </SelectItem>
                  <SelectItem value="Kodak Vision3 500T">
                    Kodak Vision3 500T
                  </SelectItem>
                  <SelectItem value="Fujifilm Neopan 100">
                    Fujifilm Neopan 100
                  </SelectItem>
                  <SelectItem value="Kodak ColorPlus 200">
                    Kodak ColorPlus 200
                  </SelectItem>
                  <SelectItem value="Ilford Pan F Plus">
                    Ilford Pan F Plus
                  </SelectItem>
                  <SelectItem value="Kodak Portra 160">
                    Kodak Portra 160
                  </SelectItem>
                  <SelectItem value="Fujifilm Superia 400">
                    Fujifilm Superia 400
                  </SelectItem>
                  <SelectItem value="Kodak Ultra Max 400">
                    Kodak Ultra Max 400
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lighting</Label>
              <Select
                value={formData.lighting}
                onValueChange={(value) => handleInputChange("lighting", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Cinematic lighting">
                    Cinematic lighting
                  </SelectItem>
                  <SelectItem value="Natural light">Natural light</SelectItem>
                  <SelectItem value="Studio lighting">
                    Studio lighting
                  </SelectItem>
                  <SelectItem value="Rembrandt lighting">
                    Rembrandt lighting
                  </SelectItem>
                  <SelectItem value="Split lighting">Split lighting</SelectItem>
                  <SelectItem value="Butterfly lighting">
                    Butterfly lighting
                  </SelectItem>
                  <SelectItem value="Loop lighting">Loop lighting</SelectItem>
                  <SelectItem value="Broad lighting">Broad lighting</SelectItem>
                  <SelectItem value="Short lighting">Short lighting</SelectItem>
                  <SelectItem value="Rim lighting">Rim lighting</SelectItem>
                  <SelectItem value="Backlight">Backlight</SelectItem>
                  <SelectItem value="High key lighting">
                    High key lighting
                  </SelectItem>
                  <SelectItem value="Low key lighting">
                    Low key lighting
                  </SelectItem>
                  <SelectItem value="Golden hour">Golden hour</SelectItem>
                  <SelectItem value="Blue hour">Blue hour</SelectItem>
                  <SelectItem value="Moonlight">Moonlight</SelectItem>
                  <SelectItem value="Dramatic lighting">
                    Dramatic lighting
                  </SelectItem>
                  <SelectItem value="Soft lighting">Soft lighting</SelectItem>
                  <SelectItem value="Hard lighting">Hard lighting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Background Color</Label>
              <Select
                value={formData.backgroundColor}
                onValueChange={(value) =>
                  handleInputChange("backgroundColor", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Descriptor I</Label>
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
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Ethereal">Ethereal</SelectItem>
                  <SelectItem value="Dramatic">Dramatic</SelectItem>
                  <SelectItem value="Moody">Moody</SelectItem>
                  <SelectItem value="Vibrant">Vibrant</SelectItem>
                  <SelectItem value="Serene">Serene</SelectItem>
                  <SelectItem value="Mysterious">Mysterious</SelectItem>
                  <SelectItem value="Whimsical">Whimsical</SelectItem>
                  <SelectItem value="Elegant">Elegant</SelectItem>
                  <SelectItem value="Rustic">Rustic</SelectItem>
                  <SelectItem value="Futuristic">Futuristic</SelectItem>
                  <SelectItem value="Vintage">Vintage</SelectItem>
                  <SelectItem value="Minimalistic">Minimalistic</SelectItem>
                  <SelectItem value="Chaotic">Chaotic</SelectItem>
                  <SelectItem value="Dreamy">Dreamy</SelectItem>
                  <SelectItem value="Dynamic">Dynamic</SelectItem>
                  <SelectItem value="Peaceful">Peaceful</SelectItem>
                  <SelectItem value="Energetic">Energetic</SelectItem>
                  <SelectItem value="Melancholic">Melancholic</SelectItem>
                  <SelectItem value="Surreal">Surreal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Descriptor II</Label>
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
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Ethereal">Ethereal</SelectItem>
                  <SelectItem value="Dramatic">Dramatic</SelectItem>
                  <SelectItem value="Moody">Moody</SelectItem>
                  <SelectItem value="Vibrant">Vibrant</SelectItem>
                  <SelectItem value="Serene">Serene</SelectItem>
                  <SelectItem value="Mysterious">Mysterious</SelectItem>
                  <SelectItem value="Whimsical">Whimsical</SelectItem>
                  <SelectItem value="Elegant">Elegant</SelectItem>
                  <SelectItem value="Rustic">Rustic</SelectItem>
                  <SelectItem value="Futuristic">Futuristic</SelectItem>
                  <SelectItem value="Vintage">Vintage</SelectItem>
                  <SelectItem value="Minimalistic">Minimalistic</SelectItem>
                  <SelectItem value="Chaotic">Chaotic</SelectItem>
                  <SelectItem value="Dreamy">Dreamy</SelectItem>
                  <SelectItem value="Dynamic">Dynamic</SelectItem>
                  <SelectItem value="Peaceful">Peaceful</SelectItem>
                  <SelectItem value="Energetic">Energetic</SelectItem>
                  <SelectItem value="Melancholic">Melancholic</SelectItem>
                  <SelectItem value="Surreal">Surreal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => handleInputChange("artist", e.target.value)}
                placeholder="Enter artist name"
              />
            </div>

            <div>
              <Label htmlFor="filmName">Film</Label>
              <Input
                id="filmName"
                value={formData.filmName}
                onChange={(e) => handleInputChange("filmName", e.target.value)}
                placeholder="Enter film name"
              />
            </div>
          </div>
          <div>
            <div >
              <Label>Style reference</Label>

            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                id="styleReference"
                value={formData.styleReference}
                type="number"
                onChange={(e) =>
                  handleInputChange("styleReference", e.target.value)
                }
                placeholder="Enter style reference (Numbers only)"
                disabled={formData.styleRandom}
              />
              <Checkbox
                id="styleRandom"
                checked={formData.styleRandom}
                onCheckedChange={(checked) =>
                  handleInputChange("styleRandom", checked as boolean)
                }
              />
              <Label htmlFor="styleRandom">Random</Label>
            </div>
          </div>
          <div>
            <Label htmlFor="ignoreWords">Ignore these words:</Label>
            <Textarea
              id="ignoreWords"
              value={formData.ignoreWords}
              onChange={(e) => handleInputChange("ignoreWords", e.target.value)}
              placeholder="Enter words to ignore"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tile"
                checked={formData.tile}
                onCheckedChange={(checked) =>
                  handleInputChange("tile", checked as boolean)
                }
              />
              <Label htmlFor="tile">Tile</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="styleRaw"
                checked={formData.styleRaw}
                onCheckedChange={(checked) =>
                  handleInputChange("styleRaw", checked as boolean)
                }
              />
              <Label htmlFor="styleRaw">Style Raw</Label>
            </div>
          </div>

          <Button
            onClick={generatePrompt}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Generate Prompt Output
          </Button>

          {generatedPrompt && (
            <div className="space-y-4">
              <Textarea
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full"
              >
                <ClipboardCopy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
