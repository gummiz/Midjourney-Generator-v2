'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ClipboardCopy, Link } from "lucide-react"

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
  };

  // const [formData, setFormData] = useState<FormData>({
  //   medium: "",
  //   subject: "",
  //   environment: "",
  //   composition: {
  //     view: "None",
  //     camera: "None",
  //     lens: "None",
  //     lighting: "None",
  //   },
  //   style: {
  //     descriptorI: "None",
  //     descriptorII: "None",
  //     artist: "",
  //     filmName: "",
  //   },
  //   aspectRatio: "1:1",
  //   ignoreWords: "",
  //   tile: false,
  //   styleRaw: false
  // });

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
    aspectRatio: "1:1",
    ignoreWords: "",
    tile: false,
    styleRaw: false,
    styleReference: "",
    styleRandom: false,
  });

  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Add new state for copy status
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const generatePrompt = () => {
    let prompt = ""

    // MEDIUM and SUBJECT
    prompt += `${formData.medium} of ${formData.subject}`

    // ENVIRONMENT
    if (formData.environment) {
      prompt += ` in ${formData.environment}`
    }

    // COMPOSITION
    if (formData.view !== "None") prompt += `, ${formData.view}`
    if (formData.camera !== "None") prompt += `, ${formData.camera}`
    if (formData.lens !== "None") prompt += `, ${formData.lens}`
    if (formData.lighting !== "None") prompt += `, ${formData.lighting}`

    // STYLE
    if (formData.descriptorI !== "None") prompt += `, ${formData.descriptorI}`
    if (formData.descriptorII !== "None") prompt += `, ${formData.descriptorII}`
    if (formData.artist) prompt += `, by ${formData.artist}`
    if (formData.filmName) prompt += `, ${formData.filmName} film style`

    // Additional parameters
    if (formData.tile) prompt += " --tile"
    if (formData.styleRaw) prompt += " --style raw"
    if (formData.aspectRatio !== "None") prompt += ` --ar ${formData.aspectRatio}`
    if (formData.ignoreWords) prompt += ` --no ${formData.ignoreWords}`

    setGeneratedPrompt(prompt)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };


  return (
    <Card className="w-full max-w-3xl mx-auto">
     <CardHeader>
        <CardTitle className="text-2xl font-normal text-gray-600">
          Midjourney Prompt Helper{" "}
        </CardTitle>
        <CardDescription>

            <span className="descriptionblack">A handy tool for generating advanced prompts in  <a href="https://midjourney.com/" target="_blank" rel="noopener noreferrer">Midjourney</a>.
            Version 2 - November 2024 - <a href="https://github.com/gummiz/Midjourney-Generator" target="_blank" rel="noopener noreferrer">Quickguide</a></span>
            <br/>Developed by Stefan Kummerlöw.
            Connect with me on <a href="https://bit.ly/kummerloewLinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a>, <a href="https://bit.ly/GithubTadaptive" target="_blank" rel="noopener noreferrer">GitHub</a>, <a href="https://bit.ly/XTadaptive" target="_blank" rel="noopener noreferrer">X</a> and  <a href="https://bit.ly/IGTadaptive" target="_blank" rel="noopener noreferrer">Instagram</a>

        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* MEDIUM */}
          <div>
            <Label>MEDIUM</Label>
            <CardDescription className="text-sm mb-2">Choose the artistic medium for your image</CardDescription>
            <Select value={formData.medium} onValueChange={(value) => handleInputChange("medium", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Digital Art">Digital Art</SelectItem>
                <SelectItem value="Oil Painting">Oil Painting</SelectItem>
                <SelectItem value="Watercolor">Watercolor</SelectItem>
                <SelectItem value="Photography">Photography</SelectItem>
                <SelectItem value="3D Render">3D Render</SelectItem>
                <SelectItem value="Pencil Sketch">Pencil Sketch</SelectItem>
                <SelectItem value="Vector Art">Vector Art</SelectItem>
                <SelectItem value="Cinematic Portrait">Cinematic Portrait</SelectItem>
                <SelectItem value="Pixel Art">Pixel Art</SelectItem>
                <SelectItem value="Comic Style">Comic Style</SelectItem>
                <SelectItem value="Concept Art">Concept Art</SelectItem>
                <SelectItem value="Character Design">Character Design</SelectItem>
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

          <Separator />

          {/* SUBJECT */}
          <div>
            <Label htmlFor="subject">SUBJECT</Label>
            <CardDescription className="text-sm mb-2">Describe the main focus of your image</CardDescription>
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
            <Label htmlFor="environment">ENVIRONMENT</Label>
            <CardDescription className="text-sm mb-2">Describe the setting or background</CardDescription>
            <Textarea
              id="environment"
              value={formData.environment}
              onChange={(e) => handleInputChange("environment", e.target.value)}
              placeholder="E.g., lush jungle, bustling marketplace"
            />
          </div>

          <Separator />

          {/* COMPOSITION */}
          <div>
            <Label>COMPOSITION</Label>
            <CardDescription className="text-sm mb-2">Define the visual arrangement and technical aspects</CardDescription>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>View</Label>
                <Select value={formData.view} onValueChange={(value) => handleInputChange("view", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Close-up">Close-up</SelectItem>
                    <SelectItem value="Wide angle">Wide angle</SelectItem>
                    <SelectItem value="Aerial view">Aerial view</SelectItem>
                    <SelectItem value="Bird's eye view">Bird's eye view</SelectItem>
                    <SelectItem value="Shallow depth of field">Shallow depth of field</SelectItem>
                    <SelectItem value="Worm's eye view">Worm's eye view</SelectItem>
                    <SelectItem value="Dutch angle">Dutch angle</SelectItem>
                    <SelectItem value="Panoramic">Panoramic</SelectItem>
                    <SelectItem value="First person">First person</SelectItem>
                    <SelectItem value="Third person">Third person</SelectItem>
                    <SelectItem value="Over the shoulder">Over the shoulder</SelectItem>
                    <SelectItem value="Profile view">Profile view</SelectItem>
                    <SelectItem value="Front view">Front view</SelectItem>
                    <SelectItem value="Back view">Back view</SelectItem>
                    <SelectItem value="Three-quarter view">Three-quarter view</SelectItem>
                    <SelectItem value="Isometric">Isometric</SelectItem>
                    <SelectItem value="Macro">Macro</SelectItem>
                    <SelectItem value="Telephoto">Telephoto</SelectItem>
                    <SelectItem value="Fish eye">Fish eye</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Camera</Label>
                <Select value={formData.camera} onValueChange={(value) => handleInputChange("camera", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Canon EOS R5">Canon EOS R5</SelectItem>
                    <SelectItem value="Sony A7R IV">Sony A7R IV</SelectItem>
                    <SelectItem value="Nikon Z9">Nikon Z9</SelectItem>
                    <SelectItem value="Fujifilm GFX 100S">Fujifilm GFX 100S</SelectItem>
                    <SelectItem value="Hasselblad X2D">Hasselblad X2D</SelectItem>
                    <SelectItem value="Leica M11">Leica M11</SelectItem>
                    <SelectItem value="Phase One IQ4">Phase One IQ4</SelectItem>
                    <SelectItem value="Canon 5D Mark IV">Canon 5D Mark IV</SelectItem>
                    <SelectItem value="Sony A1">Sony A1</SelectItem>
                    <SelectItem value="Nikon D850">Nikon D850</SelectItem>
                    <SelectItem value="Fujifilm X-T4">Fujifilm X-T4</SelectItem>
                    <SelectItem value="Panasonic S1R">Panasonic S1R</SelectItem>
                    <SelectItem value="Olympus OM-1">Olympus OM-1</SelectItem>
                    <SelectItem value="RED V-Raptor">RED V-Raptor</SelectItem>
                    <SelectItem value="ARRI Alexa Mini">ARRI Alexa Mini</SelectItem>
                    <SelectItem value="Blackmagic URSA">Blackmagic URSA</SelectItem>
                    <SelectItem value="Canon C70">Canon C70</SelectItem>
                    <SelectItem value="Sony FX9">Sony FX9</SelectItem>
                    <SelectItem value="RED Komodo">RED Komodo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lens</Label>
                <Select value={formData.lens} onValueChange={(value) => handleInputChange("lens", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="24mm f/1.4">24mm f/1.4</SelectItem>
                    <SelectItem value="50mm f/1.2">50mm f/1.2</SelectItem>
                    <SelectItem value="85mm f/1.4">85mm f/1.4</SelectItem>
                    <SelectItem value="35mm f/1.4">35mm f/1.4</SelectItem>
                    <SelectItem value="135mm f/1.8">135mm f/1.8</SelectItem>
                    <SelectItem value="14-24mm f/2.8">14-24mm f/2.8</SelectItem>
                    <SelectItem value="24-70mm f/2.8">24-70mm f/2.8</SelectItem>
                    <SelectItem value="70-200mm f/2.8">70-200mm f/2.8</SelectItem>
                    <SelectItem value="100-400mm f/4.5-5.6">100-400mm f/4.5-5.6</SelectItem>
                    <SelectItem value="16mm f/2.8">16mm f/2.8</SelectItem>
                    <SelectItem value="20mm f/1.8">20mm f/1.8</SelectItem>
                    <SelectItem value="28mm f/1.8">28mm f/1.8</SelectItem>
                    <SelectItem value="40mm f/2">40mm f/2</SelectItem>
                    <SelectItem value="90mm f/2.8">90mm f/2.8</SelectItem>
                    <SelectItem value="100mm f/2.8 Macro">100mm f/2.8 Macro</SelectItem>
                    <SelectItem value="200mm f/2">200mm f/2</SelectItem>
                    <SelectItem value="300mm f/2.8">300mm f/2.8</SelectItem>
                    <SelectItem value="400mm f/2.8">400mm f/2.8</SelectItem>
                    <SelectItem value="600mm f/4">600mm f/4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lighting</Label>
                <Select value={formData.lighting} onValueChange={(value) => handleInputChange("lighting", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Natural light">Natural light</SelectItem>
                    <SelectItem value="Studio lighting">Studio lighting</SelectItem>
                    <SelectItem value="Dramatic lighting">Dramatic lighting</SelectItem>
                    <SelectItem value="Cinematic lighting">Cinematic lighting</SelectItem>
                    <SelectItem value="Rembrandt lighting">Rembrandt lighting</SelectItem>
                    <SelectItem value="Split lighting">Split lighting</SelectItem>
                    <SelectItem value="Butterfly lighting">Butterfly lighting</SelectItem>
                    <SelectItem value="Loop lighting">Loop lighting</SelectItem>
                    <SelectItem value="Broad lighting">Broad lighting</SelectItem>
                    <SelectItem value="Short lighting">Short lighting</SelectItem>
                    <SelectItem value="Rim lighting">Rim lighting</SelectItem>
                    <SelectItem value="Backlight">Backlight</SelectItem>
                    <SelectItem value="High key lighting">High key lighting</SelectItem>
                    <SelectItem value="Low key lighting">Low key lighting</SelectItem>
                    <SelectItem value="Golden hour">Golden hour</SelectItem>
                    <SelectItem value="Blue hour">Blue hour</SelectItem>
                    <SelectItem value="Moonlight">Moonlight</SelectItem>
                    <SelectItem value="Soft lighting">Soft lighting</SelectItem>
                    <SelectItem value="Hard lighting">Hard lighting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* STYLE */}
          <div>
            <Label>STYLE</Label>
            <CardDescription className="text-sm mb-2">Define the artistic style and mood</CardDescription>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Descriptor I</Label>
                <Select value={formData.descriptorI} onValueChange={(value) => handleInputChange("descriptorI", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Vibrant">Vibrant</SelectItem>
                    <SelectItem value="Moody">Moody</SelectItem>
                    <SelectItem value="Ethereal">Ethereal</SelectItem>
                    <SelectItem value="Minimalistic">Minimalistic</SelectItem>
                    <SelectItem value="Dramatic">Dramatic</SelectItem>
                    <SelectItem value="Serene">Serene</SelectItem>
                    <SelectItem value="Mysterious">Mysterious</SelectItem>
                    <SelectItem value="Whimsical">Whimsical</SelectItem>
                    <SelectItem value="Elegant">Elegant</SelectItem>
                    <SelectItem value="Rustic">Rustic</SelectItem>
                    <SelectItem value="Chaotic">Chaotic</SelectItem>
                    <SelectItem value="Dynamic">Dynamic</SelectItem>
                    <SelectItem value="Peaceful">Peaceful</SelectItem>
                    <SelectItem value="Energetic">Energetic</SelectItem>
                    <SelectItem value="Melancholic">Melancholic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Descriptor II</Label>
                <Select value={formData.descriptorII} onValueChange={(value) => handleInputChange("descriptorII", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Surreal">Surreal</SelectItem>
                    <SelectItem value="Vintage">Vintage</SelectItem>
                    <SelectItem value="Futuristic">Futuristic</SelectItem>
                    <SelectItem value="Dreamy">Dreamy</SelectItem>
                    <SelectItem value="Dramatic">Dramatic</SelectItem>
                    <SelectItem value="Serene">Serene</SelectItem>
                    <SelectItem value="Mysterious">Mysterious</SelectItem>
                    <SelectItem value="Whimsical">Whimsical</SelectItem>
                    <SelectItem value="Elegant">Elegant</SelectItem>
                    <SelectItem value="Rustic">Rustic</SelectItem>
                    <SelectItem value="Chaotic">Chaotic</SelectItem>
                    <SelectItem value="Dynamic">Dynamic</SelectItem>
                    <SelectItem value="Peaceful">Peaceful</SelectItem>
                    <SelectItem value="Energetic">Energetic</SelectItem>
                    <SelectItem value="Melancholic">Melancholic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => handleInputChange("artist", e.target.value)}
                  placeholder="E.g., Vincent van Gogh"
                />
              </div>
              <div>
                <Label htmlFor="filmName">Film Style</Label>
                <Input
                  id="filmName"
                  value={formData.filmName}
                  onChange={(e) => handleInputChange("filmName", e.target.value)}
                  placeholder="E.g., Film Noir"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Parameters */}
          <div>
            <Label>Additional Parameters</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Aspect Ratio</Label>
                <Select value={formData.aspectRatio} onValueChange={(value) => handleInputChange("aspectRatio", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                    <SelectItem value="3:2">Landscape (3:2)</SelectItem>
                    <SelectItem value="2:3">Portrait (2:3)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="5:7">Portrait (5:7)</SelectItem>
                    <SelectItem value="1:2">Portrait (1:2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ignoreWords">Ignore Words</Label>
                <Input
                  id="ignoreWords"
                  value={formData.ignoreWords}
                  onChange={(e) => handleInputChange("ignoreWords", e.target.value)}
                  placeholder="E.g., blur, text"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tile"
                  checked={formData.tile}
                  onCheckedChange={(checked) => handleInputChange("tile", checked as boolean)}
                />
                <Label htmlFor="tile">Tile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="styleRaw"
                  checked={formData.styleRaw}
                  onCheckedChange={(checked) => handleInputChange("styleRaw", checked as boolean)}
                />
                <Label htmlFor="styleRaw">Style Raw</Label>
              </div>
            </div>
          </div>

          <Button onClick={generatePrompt} className="w-full bg-purple-500 hover:bg-purple-600">
            Generate Prompt
          </Button>

          {generatedPrompt && (
            <div className="space-y-4">
              <Textarea
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={copyToClipboard} variant="outline" className="w-full">
                <ClipboardCopy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}