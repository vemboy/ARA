// SharePopup.tsx
import React, { useState } from 'react';
import { Mail, Link2, Twitter, Facebook } from 'lucide-react';

interface SharePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordTitle: string;
  recordId: string;
}

const SharePopup = ({ open, onOpenChange, recordTitle, recordId }: SharePopupProps) => {
  const [copied, setCopied] = useState(false);
  
  if (!open) return null;

const url = typeof window !== 'undefined' ? 
  `${window.location.origin}/record-details/${recordId}` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    const shareText = `Check out ${recordTitle} on Armenian Record Archive`;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Armenian Record Archive - ' + recordTitle)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`;
        break;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        <button 
          onClick={() => onOpenChange(false)}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            border: 'none',
            background: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--ara-blue)'
          }}
        >
          ×
        </button>

        <h2 style={{ 
          marginBottom: '1.5rem', 
          color: 'var(--ara-blue)',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          Share Record
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--ara-blue)',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              color: 'var(--ara-blue)',
              width: '100%',
              justifyContent: 'flex-start'
            }}
          >
            <Link2 size={16} />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <button 
            onClick={() => handleShare('twitter')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--ara-blue)',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              color: 'var(--ara-blue)',
              width: '100%',
              justifyContent: 'flex-start'
            }}
          >
            <Twitter size={16} />
            Share on X
          </button>

          <button
            onClick={() => handleShare('facebook')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--ara-blue)',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              color: 'var(--ara-blue)',
              width: '100%',
              justifyContent: 'flex-start'
            }}
          >
            <Facebook size={16} />
            Share on Facebook
          </button>

          <button
            onClick={() => handleShare('email')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--ara-blue)',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              color: 'var(--ara-blue)',
              width: '100%',
              justifyContent: 'flex-start'
            }}
          >
            <Mail size={16} />
            Share via Email
          </button>
        </div>
      </div>
    </div>
  );
};

console.log("hi")

export default SharePopup;