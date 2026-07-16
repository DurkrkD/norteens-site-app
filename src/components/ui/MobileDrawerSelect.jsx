import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

export default function MobileDrawerSelect({
  value,
  onValueChange,
  placeholder,
  options,
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal select-none"
        >
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {selectedLabel}
          </span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{placeholder}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-1 max-h-[60vh] overflow-y-auto">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onValueChange(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm flex items-center justify-between transition-colors select-none ${
                o.value === value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {o.label}
              {o.value === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}