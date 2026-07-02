import moment from "moment";
import { colorArray } from "./constants";
import chroma from 'chroma-js';
import { toast } from "sonner";


export type ErrorPayload = Record<string, any>;
export function getErrorMap(error: string | ErrorPayload) {
  if (!Boolean(error)) {
    return 'Unknown Error';
  }

  return Object.values(error)
    .flat(Infinity)
    .map((data) => {
      if (typeof data === 'object') {
        return Object.values(data as any);
      }
      return data;
    })
    .join();
}

export function commaSeparator(value: string | number) {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function pickRandomValue(items: string[]){
  return items[Math.floor(Math.random() * items.length)] as string
}

export function cleanJsonData(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (["", undefined, null].includes(obj[key])) {
        delete obj[key];
      }
    });
  
    return obj;
  }

 export function capitalize(str: string) {
    if (!str || typeof str !== 'string') {
        return str;
      }
    return str.split(' ')
    .map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
  }

export function mapSelectOptions(list: any[], key?: string){
  if(key) return list?.map((item) => ({label: item?.[key].name, value:item?.[key].id, color: item?.[key]?.color || getRandomColor()}))
  return list?.map((item) => ({label: item?.name, value:item?.id, color: item?.color || getRandomColor()}))
}


const getRandomColor = () => {
  return colorArray[Math.floor(Math.random() * colorArray.length)];
};

export const assignColorsToOptions: (options: any[]) => any[] = (options: any[]) => {
  return options.map(option => ({
    ...option,
    color: option.color || getRandomColor()
  }));
};

export function formatDateReadable(dateString: string | null | undefined, format="Do MMMM, YYYY"){
  if(dateString){
    return moment(dateString).format(format)
  }
  return dateString
}

export function formatGender(gender: string | null | undefined){
  if(gender){
    if(["m", "f"].includes(gender)){
      if(gender === "m"){
        return "Male"
      }
      return "Female"
    }
  }
  return gender
}

export function boolToYesNo(bool: boolean){
  if([true, "true"].includes(bool)){
    return "Yes"
  }
  return "No"
}

export function stringToBool(string: string | undefined){
  if(string){
    if([true, "true"].includes(string)){
      return true
    }
  }
  return false
}

export function debounce<T extends any[]>(func: (...args: T) => void, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return (...args: T) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

export function formatText(text: string){
  return text?.replaceAll("_", " ")
}

export function colorPalate(colorValue: string){
  const color = chroma(colorValue || "#000000");
  const bgColor  = color.alpha(0.1).hex()
  return {
    color: color.darken(1).hex(),
    bgColor: bgColor
  }
}


export const handleDownload = async (fileUrl: string = "", fileName: string = "") => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // Can include extension, e.g., 'file.pdf'
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Download failed')
      console.error('Download failed:', error);
    }
  };

  export function downloadCSV(url:string, fileName: string) {
        const csvUrl = url
        const link = document.createElement('a');
        link.href = csvUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  export function percentage(partialValue: number, totalValue: number) {
    if(totalValue === 0) return 0
    return ( partialValue * totalValue) / 100;
  }

  