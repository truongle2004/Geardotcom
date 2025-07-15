'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

interface EventPosterDialogProps {
  posterUrl: string;
  alt?: string;
  autoOpen?: boolean;
}

export default function EventPosterDialog({
  posterUrl,
  alt = 'Event Poster',
  autoOpen = true
}: EventPosterDialogProps) {
  const [open, setOpen] = React.useState(autoOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Custom overlay with backdrop blur */}
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50" />

      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-fit z-50">
        {/* avoid error of no title*/}
        <DialogTitle>{}</DialogTitle>
        <Image
          src={posterUrl}
          alt={alt}
          width={400} // adjust based on your design
          height={700}
          className="rounded object-contain"
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh'
          }}
          priority
        />
      </DialogContent>
    </Dialog>
  );
}
