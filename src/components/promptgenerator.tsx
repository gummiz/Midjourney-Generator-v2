"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

interface InputField {
  name: string;
  label: string;
  type: string;
  options?: Array<{ value: string; label: string; group?: string }>;
  fullWidth?: boolean;
}

interface InputGroup {
  title: string;
  description: string;
  fields: InputField[];
}

const PromptGenerator = () => {
  const [formData, setFormData] = useState({
    // Basic composition
    medium: '',
    subject: '',
    environment: '',

    // Technical aspects
    view: '',
    camera: '',
    lens: '',
    lighting: '',

    // Style and mood
    descriptorI: '', // mood/emotion
    descriptorII: '', // art movement
    artist: '',
    filmStyle: '',
    timeEpoch: '',

    // Parameters
    aspectRatio: '16:9',
    styleReference: '',
    styleReferenceUrl: '',
    ignoreWords: '',
    tile: false,
    styleRaw: false,
    version: '--v 6.1'
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePrompt = () => {
    const elements = [
      // Style Reference URL
      formData.styleReferenceUrl,

      // Basic composition
      [formData.medium, formData.subject]
        .filter(Boolean)
        .join(' of '),

      // Environment
      formData.environment,

      // Technical aspects
      formData.view !== 'None' && formData.view,
      formData.camera !== 'None' && formData.camera,
      formData.lens !== 'None' && formData.lens,
      formData.lighting !== 'None' && formData.lighting,

      // Style and mood
      formData.descriptorI !== 'None' && formData.descriptorI,
      formData.descriptorII !== 'None' && formData.descriptorII,
      formData.artist && `by ${formData.artist}`,
      formData.filmStyle && `${formData.filmStyle} film style`,
      formData.timeEpoch !== 'None' && formData.timeEpoch && `Time Period: ${formData.timeEpoch}`,
    ];

    // Build parameters string
    const parameters = [
      formData.tile && '--tile',
      formData.styleRaw && '--style raw',
      formData.aspectRatio && `--ar ${formData.aspectRatio}`,
      formData.ignoreWords && `--no ${formData.ignoreWords}`,
      formData.styleReference && `--sref ${formData.styleReference}`,
      formData.version
    ].filter(Boolean).join(' ');

    return `${elements.filter(Boolean).join(', ')} ${parameters}`;
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatePrompt());
    // Could add a toast notification here
  };

  const renderInputGroup = ({ title, description, fields }: InputGroup) => (
    <div className="space-y-4">
      <div>
        <Label className="font-bold uppercase">{title}</Label>
        <CardDescription className="text-sm mb-2">
          {description}
        </CardDescription>
        <div className="grid grid-cols-1 gap-4">
          {fields.map(({ name, label, type, options, fullWidth }) => (
            <div key={name} className={`grid w-full items-center gap-1.5 ${fullWidth ? 'col-span-1' : 'md:col-span-1'}`}>
              <Label htmlFor={name} className="font-bold">{label}</Label>
              {type === 'select' ? (
                <Select
                  value={formData[name as keyof typeof formData] as string}
                  onValueChange={(value) => handleInputChange(name, value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {!options?.some(opt => opt.group) && <SelectItem value="None">None</SelectItem>}

                    {Array.from(new Set(options?.filter(opt => opt.group).map(opt => opt.group))).map(group => (
                      <SelectGroup key={group} className="pb-2">
                        <SelectLabel>{group}</SelectLabel>
                        {options?.filter(opt => opt.group === group).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === 'checkbox' ? (
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox
                    id={name}
                    checked={formData[name as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(name, !!checked)}
                  />
                  <span className="text-sm text-gray-600">Enable</span>
                </div>
              ) : (
                <Input
                  id={name}
                  type="text"
                  value={formData[name as keyof typeof formData] as string}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  className="h-10"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto mb-32">
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
      <CardContent>
        <form className="space-y-6">
          {renderInputGroup({
            title: 'Basic Composition',
            description: 'Choose the artistic medium and describe the main focus of your image',
            fields: [
              {
                name: 'medium',
                label: 'Medium',
                type: 'select',
                fullWidth: false,
                options: [
                  { value: 'None', label: 'None' },
                  // Favorite Mediums
                  { value: 'Photograph', label: 'Photograph' },
                  { value: 'Product Photography', label: 'Product Photography' },
                  { value: 'Commercial Photography', label: 'Commercial Photography' },
                  { value: 'Studio Photography', label: 'Studio Photography' },
                  { value: 'Illustration', label: 'Illustration' },
                  { value: 'Character design sheet', label: 'Character design sheet' },
                  { value: '3D Model', label: '3D Model' },

                  // 2D Mediums
                  { value: 'Film Still', label: 'Film Still' },
                  { value: 'Cinematic Portrait', label: 'Cinematic Portrait' },
                  { value: 'Drawing', label: 'Drawing' },
                  { value: 'Painting', label: 'Painting' },
                  { value: '3D rendering', label: '3D rendering' },
                  { value: '3D Clay Rendered Icon', label: '3D Clay Rendered Icon' },
                  { value: 'Animation', label: 'Animation' },
                  { value: 'Billboard', label: 'Billboard' },
                  { value: 'Blueprint', label: 'Blueprint' },
                  { value: 'Risograph', label: 'Risograph' },
                  { value: 'Brochure', label: 'Brochure' },
                  { value: 'Calligraphy', label: 'Calligraphy' },
                  { value: 'Cartoon', label: 'Cartoon' },
                  { value: 'Collage', label: 'Collage' },
                  { value: 'Comic book', label: 'Comic book' },
                  { value: 'Digital art', label: 'Digital art' },
                  { value: 'Flyer', label: 'Flyer' },
                  { value: 'Folk Art', label: 'Folk Art' },
                  { value: 'Icon', label: 'Icon' },
                  { value: 'Infographic', label: 'Infographic' },
                  { value: 'Logo', label: 'Logo' },
                  { value: 'Magazine', label: 'Magazine' },
                  { value: 'Map', label: 'Map' },
                  { value: 'Movie poster', label: 'Movie poster' },
                  { value: 'Pixel art', label: 'Pixel art' },
                  { value: 'Poster', label: 'Poster' },
                  { value: 'Vector art', label: 'Vector art' },
                  { value: 'Wall mural', label: 'Wall mural' },
                  { value: 'Woodblock print', label: 'Woodblock print' },

                  // Drawing Techniques
                  { value: 'Anatomical drawing', label: 'Anatomical drawing' },
                  { value: 'Anime', label: 'Anime' },
                  { value: 'Aquarelle', label: 'Aquarelle' },
                  { value: 'Ballpoint pen drawing', label: 'Ballpoint pen drawing' },
                  { value: 'Chalk drawing', label: 'Chalk drawing' },
                  { value: 'Charcoal drawing', label: 'Charcoal drawing' },
                  { value: 'Colored pencil drawing', label: 'Colored pencil drawing' },
                  { value: 'Comics', label: 'Comics' },
                  { value: 'Crosshatch drawing', label: 'Crosshatch drawing' },
                  { value: 'India ink drawing', label: 'India ink drawing' },
                  { value: 'Ink drawing', label: 'Ink drawing' },
                  { value: 'Marker drawing', label: 'Marker drawing' },
                  { value: 'Pastel drawing', label: 'Pastel drawing' },
                  { value: 'Pencil drawing', label: 'Pencil drawing' },
                  { value: 'Pointillism drawing', label: 'Pointillism drawing' },

                  // Painting Techniques
                  { value: 'Acrylic painting', label: 'Acrylic painting' },
                  { value: 'Airbrush painting', label: 'Airbrush painting' },
                  { value: 'Digital painting', label: 'Digital painting' },
                  { value: 'Fresco painting', label: 'Fresco painting' },
                  { value: 'Gouache painting', label: 'Gouache painting' },
                  { value: 'Graffiti painting', label: 'Graffiti painting' },
                  { value: 'Oil painting', label: 'Oil painting' },
                  { value: 'Pastel painting', label: 'Pastel painting' },
                  { value: 'Watercolor painting', label: 'Watercolor painting' },
                  { value: 'Street art painting', label: 'Street art painting' },

                  // Photography
                  { value: '35mm film photography', label: '35mm film photography' },
                  { value: 'Analog photography', label: 'Analog photography' },
                  { value: 'Digital photography', label: 'Digital photography' },
                  { value: 'Infrared photography', label: 'Infrared photography' },
                  { value: 'Lomography', label: 'Lomography' },
                  { value: 'Polaroid photography', label: 'Polaroid photography' },
                  { value: 'Portrait photography', label: 'Portrait photography' },
                  { value: 'Product photography', label: 'Product photography' },
                  { value: 'Vintage film photography', label: 'Vintage film photography' },

                  // 3D Techniques
                  { value: 'Claymation', label: 'Claymation' },
                  { value: 'Diorama', label: 'Diorama' },
                  { value: 'Glass sculpture', label: 'Glass sculpture' },
                  { value: 'Ice sculpture', label: 'Ice sculpture' },
                  { value: 'Origami', label: 'Origami' },
                  { value: 'Paper mache sculpture', label: 'Paper mache sculpture' },
                  { value: 'Pottery', label: 'Pottery' },
                  { value: 'Sculpture', label: 'Sculpture' },
                  { value: 'Stained glass', label: 'Stained glass' },

                  // Displays
                  { value: '4k display', label: '4k display' },
                  { value: 'CRT display', label: 'CRT display' },
                  { value: 'Holograph display', label: 'Holograph display' },
                  { value: 'LCD display', label: 'LCD display' },
                  { value: 'LED display', label: 'LED display' },
                  { value: 'OLED display', label: 'OLED display' },
                  { value: 'Plasma display', label: 'Plasma display' },
                  { value: 'VHS tape', label: 'VHS tape' },

                  // Distance
                  { value: 'Close-up', label: 'Close-up' },
                  { value: 'Extreme close-up', label: 'Extreme close-up' },
                  { value: 'Medium shot', label: 'Medium shot' },
                  { value: 'Long shot', label: 'Long shot' },
                  { value: 'Extreme long shot', label: 'Extreme long shot' },
                  { value: 'Wide angle', label: 'Wide angle' },
                  { value: 'Ultra wide', label: 'Ultra wide' },
                  { value: 'Macro', label: 'Macro' },
                  { value: 'Telephoto', label: 'Telephoto' },
                  { value: 'Super telephoto', label: 'Super telephoto' },

                  // Special Effects
                  { value: 'Shallow depth of field', label: 'Shallow depth of field' },
                  { value: 'Deep depth of field', label: 'Deep depth of field' },
                  { value: 'Dutch angle', label: 'Dutch angle' },
                  { value: 'Panoramic', label: 'Panoramic' },
                  { value: '360-degree', label: '360-degree' },
                  { value: 'Fish eye', label: 'Fish eye' },
                  { value: 'Tilt shift', label: 'Tilt shift' },
                  { value: 'Double exposure', label: 'Double exposure' },
                  { value: 'Multiple exposure', label: 'Multiple exposure' },
                  { value: 'Motion blur', label: 'Motion blur' },
                  { value: 'Long exposure', label: 'Long exposure' },
                  { value: 'Time-lapse', label: 'Time-lapse' }
                ]
              },
              {
                name: 'subject',
                label: 'Subject',
                type: 'text',
                fullWidth: true
              },
              {
                name: 'environment',
                label: 'Environment',
                type: 'text',
                fullWidth: false
              }
            ]
          })}

          {renderInputGroup({
            title: 'Technical Aspects',
            description: 'Define the visual arrangement and technical aspects',
            fields: [
              { name: 'view', label: 'View', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: 'Front view', label: 'Front view' },
                { value: 'Back view', label: 'Back view' },
                { value: 'Side view', label: 'Side view' },
                { value: 'Profile view', label: 'Profile view' },
                { value: 'Three-quarter view', label: 'Three-quarter view' },
                { value: '45-degree view', label: '45-degree view' },
                { value: 'Top view', label: 'Top view' },
                { value: 'Bottom view', label: 'Bottom view' },
                { value: 'Diagonal view', label: 'Diagonal view' }
              ]},
              { name: 'camera', label: 'Camera', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: 'Canon EOS R5', label: 'Canon EOS R5' },
                { value: 'Sony A7R IV', label: 'Sony A7R IV' },
                { value: 'Nikon Z9', label: 'Nikon Z9' },
                { value: 'Fujifilm GFX 100S', label: 'Fujifilm GFX 100S' },
                { value: 'Hasselblad X2D', label: 'Hasselblad X2D' },
                { value: 'Leica M11', label: 'Leica M11' }
              ]},
              { name: 'lens', label: 'Lens', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: '16mm f/2.8', label: '16mm f/2.8' },
                { value: '24mm f/1.4', label: '24mm f/1.4' },
                { value: '35mm f/1.4', label: '35mm f/1.4' },
                { value: '50mm f/1.2', label: '50mm f/1.2' },
                { value: '85mm f/1.4', label: '85mm f/1.4' }
              ]},
              { name: 'lighting', label: 'Lighting', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: 'Studio lighting', label: 'Studio lighting' },
                { value: 'Natural daylight', label: 'Natural daylight' },
                { value: 'Golden hour sunlight', label: 'Golden hour sunlight' },
                { value: 'Soft lighting', label: 'Soft lighting' },
                { value: 'Dramatic lighting', label: 'Dramatic lighting' },
                { value: 'Daylight', label: 'Daylight' },
                { value: 'Morning light', label: 'Morning light' },
                { value: 'Twilight lighting', label: 'Twilight lighting' },
                { value: 'Moonlight', label: 'Moonlight' },
                { value: 'Bioluminescence', label: 'Bioluminescence' },
                { value: 'Incandescent lighting', label: 'Incandescent lighting' },
                { value: 'Fluorescent lighting', label: 'Fluorescent lighting' },
                { value: 'Neon lighting', label: 'Neon lighting' },
                { value: 'LED lights', label: 'LED lights' },
                { value: 'Backlighting', label: 'Backlighting' },
                { value: 'Overhead lighting', label: 'Overhead lighting' },
                { value: 'Wall sconce light', label: 'Wall sconce light' },
                { value: 'Pendant light', label: 'Pendant light' },
                { value: 'Night light', label: 'Night light' },
                { value: 'Candle light', label: 'Candle light' },
                { value: 'Firelight', label: 'Firelight' },
                { value: 'Edison bulb', label: 'Edison bulb' },
                { value: 'Vacuum tube bulb', label: 'Vacuum tube bulb' },
                { value: 'Nixie tube bulb', label: 'Nixie tube bulb' },
                { value: 'Christmas lights', label: 'Christmas lights' },
                { value: 'Party lighting', label: 'Party lighting' },
                { value: 'Black light', label: 'Black light' },
                { value: 'UV light', label: 'UV light' }
              ]}
            ]
          })}

          {renderInputGroup({
            title: 'Style & Mood',
            description: 'Define the artistic style and mood',
            fields: [
              { name: 'descriptorI', label: 'Mood/Emotion', type: 'select', options: [
                // { value: 'None', label: 'None', group: "Basic Emotions" },
                // Basic Emotions
                { value: 'Happy', label: 'Happy', group: 'Basic Emotions' },
                { value: 'Sad', label: 'Sad', group: 'Basic Emotions' },
                { value: 'Angry', label: 'Angry', group: 'Basic Emotions' },
                { value: 'Fearful', label: 'Fearful', group: 'Basic Emotions' },
                { value: 'Surprised', label: 'Surprised', group: 'Basic Emotions' },
                { value: 'Disgusted', label: 'Disgusted', group: 'Basic Emotions' },
                // Positive Moods
                { value: 'Joyful', label: 'Joyful', group: 'Positive Moods' },
                { value: 'Excited', label: 'Excited', group: 'Positive Moods' },
                { value: 'Peaceful', label: 'Peaceful', group: 'Positive Moods' },
                { value: 'Serene', label: 'Serene', group: 'Positive Moods' },
                { value: 'Content', label: 'Content', group: 'Positive Moods' },
                { value: 'Optimistic', label: 'Optimistic', group: 'Positive Moods' },
                { value: 'Playful', label: 'Playful', group: 'Positive Moods' },
                // Negative Moods
                { value: 'Melancholic', label: 'Melancholic', group: 'Negative Moods' },
                { value: 'Gloomy', label: 'Gloomy', group: 'Negative Moods' },
                { value: 'Anxious', label: 'Anxious', group: 'Negative Moods' },
                { value: 'Depressed', label: 'Depressed', group: 'Negative Moods' },
                { value: 'Frustrated', label: 'Frustrated', group: 'Negative Moods' },
                { value: 'Lonely', label: 'Lonely', group: 'Negative Moods' },
                // Complex Moods
                { value: 'Nostalgic', label: 'Nostalgic', group: 'Complex Moods' },
                { value: 'Mysterious', label: 'Mysterious', group: 'Complex Moods' },
                { value: 'Contemplative', label: 'Contemplative', group: 'Complex Moods' },
                { value: 'Bittersweet', label: 'Bittersweet', group: 'Complex Moods' },
                { value: 'Ambivalent', label: 'Ambivalent', group: 'Complex Moods' },
                // Atmospheric Moods
                { value: 'Ethereal', label: 'Ethereal', group: 'Atmospheric Moods' },
                { value: 'Dramatic', label: 'Dramatic', group: 'Atmospheric Moods' },
                { value: 'Mystical', label: 'Mystical', group: 'Atmospheric Moods' },
                { value: 'Whimsical', label: 'Whimsical', group: 'Atmospheric Moods' },
                { value: 'Chaotic', label: 'Chaotic', group: 'Atmospheric Moods' },
                { value: 'Tranquil', label: 'Tranquil', group: 'Atmospheric Moods' },
                // Energetic States
                { value: 'Vibrant', label: 'Vibrant', group: 'Energetic States' },
                { value: 'Energetic', label: 'Energetic', group: 'Energetic States' },
                { value: 'Dynamic', label: 'Dynamic', group: 'Energetic States' },
                { value: 'Bold', label: 'Bold', group: 'Energetic States' },
                { value: 'Intense', label: 'Intense', group: 'Energetic States' }
              ]},
              { name: 'descriptorII', label: 'Art Movement', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: 'Art Deco', label: 'Art Deco' },
                { value: 'Art Nouveau', label: 'Art Nouveau' },
                { value: 'Baroque', label: 'Baroque' },
                { value: 'Bauhaus', label: 'Bauhaus' },
                { value: 'Cubism', label: 'Cubism' },
                { value: 'Expressionism', label: 'Expressionism' },
                { value: 'Impressionism', label: 'Impressionism' },
                { value: 'Minimalism', label: 'Minimalism' },
                { value: 'Pop Art', label: 'Pop Art' },
                { value: 'Surrealism', label: 'Surrealism' },
                { value: 'Street Art', label: 'Street Art' },
                { value: 'Ukiyo-e', label: 'Ukiyo-e' }
              ]},
              { name: 'timeEpoch', label: 'Time Period', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: 'Ancient', label: 'Ancient (3000 BCE - 500 CE)' },
                { value: 'Medieval', label: 'Medieval (500-1400)' },
                { value: 'Renaissance', label: 'Renaissance (1400-1600)' },
                { value: 'Baroque', label: 'Baroque (1600-1750)' },
                { value: 'Enlightenment', label: 'Enlightenment (1700-1800)' },
                { value: 'Victorian', label: 'Victorian (1837-1901)' },
                { value: 'Modern', label: 'Modern (1901-1945)' },
                { value: 'Post-Modern', label: 'Post-Modern (1945-2000)' },
                { value: 'Contemporary', label: 'Contemporary (2000-Present)' },
                { value: 'Futuristic', label: 'Futuristic' }
              ]}
            ]
          })}

          {renderInputGroup({
            title: 'Artist & Film Style',
            description: 'Add artist influence and cinematic style',
            fields: [
              { name: 'artist', label: 'Artist', type: 'text' },
              { name: 'filmStyle', label: 'Film Style', type: 'text' }
            ]
          })}

          {renderInputGroup({
            title: 'Additional Parameters',
            description: 'Define additional parameters for your image',
            fields: [
              { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: [
                { value: '1:1', label: 'Square (1:1)' },
                { value: '4:3', label: 'Landscape (4:3)' },
                { value: '16:9', label: 'Landscape (16:9)' },
                { value: '3:2', label: 'Landscape (3:2)' },
                { value: '2:3', label: 'Portrait (2:3)' },
                { value: '9:16', label: 'Portrait (9:16)' },
                { value: '5:7', label: 'Portrait (5:7)' },
                { value: '1:2', label: 'Portrait (1:2)' }
              ]},
              { name: 'styleReference', label: 'Style Reference', type: 'text' },
              { name: 'styleReferenceUrl', label: 'Reference Image URL', type: 'text' },
              { name: 'ignoreWords', label: 'Ignore Words', type: 'text' },
              { name: 'tile', label: 'Tile', type: 'checkbox' },
              { name: 'styleRaw', label: 'Style Raw', type: 'checkbox' }
            ]
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
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Fill in the desired fields above to generate your Midjourney prompt. Empty fields will be omitted.
      </CardFooter>
    </Card>
  );
};

export default PromptGenerator;
