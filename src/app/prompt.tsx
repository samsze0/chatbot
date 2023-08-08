import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Close as DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

export function Prompt({
  className,
  input,
  handleInputChange,
  handleSubmit,
  ...props
}: {
  className?: string;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          {t("Prompt")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="h-[80%] w-[90%] p-0 border-0 shadow-none bg-transparent"
        showClose={false}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-background">
          <Textarea
            className="flex-1 resize-none text-base text-foreground/80 leading-relaxed"
            onFocus={(e) => {
              e.target.selectionStart = e.target.value.length;
              e.target.selectionEnd = e.target.value.length;
            }}
            value={input}
            placeholder={t("Prompt")}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // @ts-ignore
                e.target.form.requestSubmit();
                e.preventDefault();
                closeButtonRef.current?.click();
              }
            }}
          />
          <div className="flex flex-row gap-2 self-end">
            <DialogClose asChild>
              <Button variant="outline" ref={closeButtonRef}>
                {t("Close")}
              </Button>
            </DialogClose>
            <Button type="submit" variant="default">
              {t("Submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
