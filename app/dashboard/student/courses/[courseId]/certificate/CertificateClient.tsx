'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CertificateProps {
  user: { name: string; id: string };
  course: { title: string; id: string };
  instructorName: string;
  progressPercentage: number;
}

export default function CertificateClient({ user, course, instructorName, progressPercentage }: CertificateProps) {
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Redirect if course not completed
  useEffect(() => {
    if (progressPercentage < 100) {
      toast.error('Course not completed yet.');
      router.push(`/dashboard/student/courses/${course.id}`);
    }
  }, [progressPercentage, course.id, router]);

  // Handle image load to ensure html2canvas captures it
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) {
      toast.error('Certificate element not found.');
      return;
    }

    try {
      // Wait for fonts and images to load
      await document.fonts.ready;
      if (!isImageLoaded) {
        toast.error('Logo image not loaded yet. Please try again.');
        return;
      }

      // Add a slight delay to ensure all resources are rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: true, // Enable logging for debugging
        backgroundColor: null, // Preserve transparent background
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`);
      toast.success('Certificate downloaded!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download certificate. Please try again.');
    }
  };

  if (progressPercentage < 100) {
    return null; // Redirect will handle this
  }

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f7fafc', padding: '2.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '2rem' }}>
          Your Certificate
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            ref={certificateRef}
            style={{
              width: '297mm',
              height: '210mm',
              boxSizing: 'border-box',
              fontFamily: "'Merriweather', serif",
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%)',
              border: '8px solid #2d3748',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '3rem',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              borderRadius: '0.5rem',
              overflow: 'hidden',
            }}
          >
            {/* Decorative Border */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                bottom: '10px',
                border: '4px solid #84cc16',
                borderRadius: '0.5rem',
              }}
            ></div>

            {/* Logo Placeholder */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
              <Image
                src="/Logo.png"
                width={160}
                height={50}
                alt="QuestCore LearnHub Logo"
                onLoad={handleImageLoad}
                onError={() => toast.error('Failed to load logo image.')}
                priority
              />
            </div>

            {/* Certificate Title */}
            <h1
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#2d3748',
                marginBottom: '2rem',
                fontFamily: "'Merriweather', serif",
              }}
            >
              Certificate of Achievement
            </h1>

            {/* Certify Text */}
            <p
              style={{
                fontSize: '1.125rem',
                color: '#4a5568',
                marginBottom: '1rem',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              This certifies that
            </p>

            {/* User Name */}
            <h2
              style={{
                fontSize: '2.25rem',
                fontWeight: '600',
                color: '#84cc16',
                marginBottom: '1.5rem',
                fontFamily: "'Merriweather', serif",
                textDecoration: 'underline',
              }}
            >
              {user.name}
            </h2>

            {/* Completion Text */}
            <p
              style={{
                fontSize: '1.125rem',
                color: '#4a5568',
                marginBottom: '1rem',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              has successfully completed the course
            </p>

            {/* Course Title */}
            <h3
              style={{
                fontSize: '1.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '2rem',
                fontFamily: "'Merriweather', serif",
              }}
            >
              {course.title}
            </h3>

            {/* Platform and Date */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '32rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Offered by
                </p>
                <p
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  QuestCore LearnHub
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Awarded on
                </p>
                <p
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: '#2d3748',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  {today}
                </p>
              </div>
            </div>

            {/* Certificate Number */}
            <p
              style={{
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '3rem',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Certificate Number: {course.id}-{user.id}
            </p>

            {/* Signatures */}
            <div
              style={{
                position: 'absolute',
                bottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '32rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <hr style={{ borderTop: '2px solid #4a5568', width: '8rem', marginBottom: '0.5rem', margin: '0 auto' }} />
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#4a5568',
                    fontWeight: 'bold',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  {instructorName}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#718096',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Course Instructor
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <hr style={{ borderTop: '2px solid #4a5568', width: '8rem', marginBottom: '0.5rem', margin: '0 auto' }} />
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#4a5568',
                    fontWeight: 'bold',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Platform Director
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#718096',
                    fontWeight: '500',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  QuestCore LearnHub
                </p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isImageLoaded ? '#84cc16' : '#cbd5e0',
              color: '#ffffff',
              borderRadius: '0.5rem',
              cursor: isImageLoaded ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => isImageLoaded && (e.currentTarget.style.backgroundColor = '#65a30d')}
            onMouseLeave={(e) => isImageLoaded && (e.currentTarget.style.backgroundColor = '#84cc16')}
            disabled={!isImageLoaded}
          >
            {isImageLoaded ? 'Download as PDF' : 'Loading...'}
          </button>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@400;500;700&display=swap');
      `}</style>
    </main>
  );
}