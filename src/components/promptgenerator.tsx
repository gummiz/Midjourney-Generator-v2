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
  options?: Array<{ value: string; label: string }>;
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
    version: '--v 5'
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
      formData.view,
      formData.camera,
      formData.lens,
      formData.lighting,

      // Style and mood
      formData.descriptorI,
      formData.descriptorII,
      formData.artist && `by ${formData.artist}`,
      formData.filmStyle && `${formData.filmStyle} film style`,
      formData.timeEpoch !== 'None' && `Time Period: ${formData.timeEpoch}`,
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
            <div key={name} className={`flex flex-col ${fullWidth ? 'col-span-1' : 'md:col-span-1'}`}>
              <Label className="font-bold">{label}</Label>
              {type === 'select' ? (
                <Select
                  value={formData[name as keyof typeof formData] as string}
                  onValueChange={(value) => handleInputChange(name, value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === 'checkbox' ? (
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox
                    checked={formData[name as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(name, !!checked)}
                  />
                  <span className="text-sm text-gray-600">Enable</span>
                </div>
              ) : (
                <Input
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
                  // ... add more from structured generator
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
                { value: 'Dramatic lighting', label: 'Dramatic lighting' },
                { value: 'Soft lighting', label: 'Soft lighting' }
              ]}
            ]
          })}

          {renderInputGroup({
            title: 'Style & Mood',
            description: 'Define the artistic style and mood',
            fields: [
              { name: 'descriptorI', label: 'Mood/Emotion', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: 'Happy', label: 'Happy' },
                { value: 'Peaceful', label: 'Peaceful' },
                { value: 'Dramatic', label: 'Dramatic' },
                { value: 'Mysterious', label: 'Mysterious' },
                { value: 'Ethereal', label: 'Ethereal' }
              ]},
              { name: 'descriptorII', label: 'Art Movement', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: 'Art Deco', label: 'Art Deco' },
                { value: 'Art Nouveau', label: 'Art Nouveau' },
                { value: 'Baroque', label: 'Baroque' },
                { value: 'Minimalism', label: 'Minimalism' },
                { value: 'Surrealism', label: 'Surrealism' }
              ]},
              { name: 'timeEpoch', label: 'Time Period', type: 'select', options: [
                { value: 'None', label: 'None' },
                { value: 'Ancient', label: 'Ancient (3000 BCE - 500 CE)' },
                { value: 'Medieval', label: 'Medieval (500-1400)' },
                { value: 'Renaissance', label: 'Renaissance (1400-1600)' },
                { value: 'Modern', label: 'Modern (1901-1945)' },
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
                { value: '16:9', label: 'Landscape (16:9)' },
                { value: '4:3', label: 'Standard (4:3)' },
                { value: '9:16', label: 'Portrait (9:16)' }
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
