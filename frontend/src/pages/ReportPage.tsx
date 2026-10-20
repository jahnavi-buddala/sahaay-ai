import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { submitReport } from '../services/api';
import { HazardType, Incident } from '../types';
import { LocationPickerModal } from '../components/LocationPickerModal';
import { 
  Camera, 
  Upload, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Info,
  ExternalLink
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { t } = useLanguage();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [latitude, setLatitude] = useState<number>(17.4448);
  const [longitude, setLongitude] = useState<number>(78.4682);
  const [address, setAddress] = useState<string>('Begumpet, Hyderabad, Telangana');
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  const [hazardType, setHazardType] = useState<HazardType>('Waterlogging');
  const [description, setDescription] = useState<string>('');
  const [observedSeverity, setObservedSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetPhoto(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetPhoto(file);
  };

  const validateAndSetPhoto = (file?: File) => {
    setPhotoError(null);
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Supported image formats: JPG, JPEG, PNG, WEBP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('Image size exceeds 10MB. Please select a smaller photo.');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setSubmitError('Please provide a brief description of the observed road condition.');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append('hazard_type', hazardType);
    formData.append('description', description);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('address', address);
    formData.append('observed_severity', observedSeverity);
    formData.append('is_anonymous', isAnonymous ? 'true' : 'false');

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      const incident = await submitReport(formData);
      setCreatedIncident(incident);
      setCurrentStep(5);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please check network connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hazardOptions = [
    { type: 'Waterlogging' as HazardType, emoji: '🌊', label: 'Waterlogging' },
    { type: 'Flooded Road' as HazardType, emoji: '🚣', label: 'Flooded Road' },
    { type: 'Road Obstruction' as HazardType, emoji: '🚧', label: 'Road Obstruction' },
    { type: 'Damaged Road' as HazardType, emoji: '🕳️', label: 'Damaged Road' },
    { type: 'Other' as HazardType, emoji: '⚠️', label: 'Other Hazard' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-10 px-4 sm:px-6 lg:px-8 text-[#1C2E2E]">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ADD8E6]/40 text-[#2F4F4F] text-xs font-bold mb-2 border border-[#ADD8E6]">
            <Camera className="w-3.5 h-3.5" />
            <span>📸 Civic Hazard Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2F4F4F]">
            Report a Road Hazard
          </h1>
          <p className="text-xs text-[#586B6B] mt-1 max-w-md mx-auto">
            Submit visual evidence and location data. Sahaay AI analyzes the photo with computer vision and checks live weather.
          </p>
        </div>

        {/* Wizard Progress Bar */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-[#778899] mb-2 px-1">
              <span className={currentStep >= 1 ? 'text-[#2F4F4F]' : ''}>📸 1. Photo</span>
              <span className={currentStep >= 2 ? 'text-[#2F4F4F]' : ''}>📍 2. Location</span>
              <span className={currentStep >= 3 ? 'text-[#2F4F4F]' : ''}>📝 3. Details</span>
              <span className={currentStep >= 4 ? 'text-[#2F4F4F]' : ''}>🔍 4. Review</span>
            </div>
            <div className="h-2 w-full bg-[#E5E4D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2F4F4F] transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: PHOTO UPLOAD */}
        {currentStep === 1 && (
          <div className="card-soft p-6 sm:p-8 border border-[#E2DFD2] bg-white space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#2F4F4F] flex items-center gap-2">
                <span>📸</span> Step 1: Upload a Photo
              </h2>
              <p className="text-xs text-[#586B6B] mt-0.5">
                Clear street-level photographs help AI assess water pooling and texture. (Optional but strongly recommended)
              </p>
            </div>

            {photoError && (
              <div className="p-3 bg-[#FBE8E6] border border-[#E9A49A] rounded-xl text-xs text-[#8C3429] flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            {!photoPreview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#ADD8E6] hover:border-[#2F4F4F] rounded-2xl p-8 text-center bg-[#FAF8F2] transition-colors cursor-pointer"
                onClick={() => document.getElementById('photo-upload-input')?.click()}
              >
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-[#E2DFD2] flex items-center justify-center mx-auto mb-3 text-2xl">
                  📸
                </div>
                <p className="text-xs font-bold text-[#2F4F4F]">
                  Click to select or drag and drop a road photo
                </p>
                <p className="text-[11px] text-[#778899] mt-1">
                  JPG, JPEG, PNG, or WEBP (up to 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-[#E2DFD2] max-h-72 bg-black flex items-center justify-center">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-72 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-600 text-white rounded-xl backdrop-blur-xs transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-[#586B6B] px-1">
                  <span>Photo selected ({photoFile?.name})</span>
                  <button
                    type="button"
                    onClick={() => document.getElementById('photo-upload-input')?.click()}
                    className="text-[#2F4F4F] hover:underline font-bold"
                  >
                    Replace Photo
                  </button>
                  <input
                    id="photo-upload-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#E2DFD2]">
              <span className="text-[11px] text-[#778899]">
                {photoFile ? 'Photo ready for AI visual analysis' : 'You can proceed with text-only reporting'}
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white text-xs font-bold shadow-xs"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#87CEEB]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION PICKER */}
        {currentStep === 2 && (
          <div className="card-soft p-6 sm:p-8 border border-[#E2DFD2] bg-white space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#2F4F4F] flex items-center gap-2">
                <span>📍</span> Step 2: Select Location
              </h2>
              <p className="text-xs text-[#586B6B] mt-0.5">
                Accurate coordinates ensure nearby commuters receive proximity warnings and avoid this road.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E2DFD2] space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#778899] uppercase tracking-wider mb-1">
                  Street / Landmark Name
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Begumpet Underpass, Near Station"
                  className="w-full px-3 py-2 bg-white border border-[#E2DFD2] rounded-xl text-xs text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#586B6B] pt-1">
                <span>GPS Coordinates:</span>
                <span className="font-mono text-[#2F4F4F] font-bold">
                  {latitude.toFixed(5)}, {longitude.toFixed(5)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-white border border-[#ADD8E6] hover:bg-[#ADD8E6]/25 text-[#2F4F4F] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <MapPin className="w-4 h-4 text-[#778899]" />
                <span>📍 Adjust Pin on Interactive Map</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2DFD2]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2DFD2] text-[#586B6B] text-xs hover:bg-[#FAF8F2] font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white text-xs font-bold shadow-xs"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#87CEEB]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DESCRIBE THE HAZARD */}
        {currentStep === 3 && (
          <div className="card-soft p-6 sm:p-8 border border-[#E2DFD2] bg-white space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#2F4F4F] flex items-center gap-2">
                <span>📝</span> Step 3: Describe the Hazard
              </h2>
              <p className="text-xs text-[#586B6B] mt-0.5">
                Categorize the type and describe what you observe directly.
              </p>
            </div>

            {/* Hazard Options with Emojis */}
            <div>
              <label className="block text-xs font-bold text-[#2F4F4F] mb-2">
                Hazard Classification *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hazardOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setHazardType(opt.type)}
                    className={`p-3 rounded-xl text-xs font-bold text-left border transition-all flex items-center gap-2 ${
                      hazardType === opt.type
                        ? 'border-[#2F4F4F] bg-[#ADD8E6]/30 text-[#2F4F4F] shadow-xs'
                        : 'border-[#E2DFD2] bg-white text-[#586B6B] hover:border-[#778899]'
                    }`}
                  >
                    <span className="text-base">{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#2F4F4F] mb-1">
                Observed Road Condition Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Water is about 1 foot deep near the curb, bikes are slipping, drain is bubbling up..."
                className="w-full p-3 bg-white border border-[#E2DFD2] rounded-xl text-xs text-[#2F4F4F] focus:outline-none focus:border-[#2F4F4F]"
              />
            </div>

            {/* Severity impression */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#2F4F4F]">
                  Observed Severity (Your Impression)
                </label>
                <span className="text-[10px] text-[#778899]">Not treated as ground truth</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setObservedSeverity(sev)}
                    className={`py-2 px-3 rounded-xl text-xs capitalize font-bold border text-center transition-colors ${
                      observedSeverity === sev
                        ? 'border-[#2F4F4F] bg-[#ADD8E6]/30 text-[#2F4F4F]'
                        : 'border-[#E2DFD2] bg-white text-[#586B6B]'
                    }`}
                  >
                    {sev === 'low' ? '🟢 Low' : sev === 'medium' ? '🟡 Medium' : '🔴 High'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#2F4F4F] font-medium">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#2F4F4F] focus:ring-[#2F4F4F] border-[#E2DFD2]"
                />
                <span>Submit anonymously (do not link to my commuter profile)</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2DFD2]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2DFD2] text-[#586B6B] text-xs hover:bg-[#FAF8F2] font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!description.trim()) {
                    setSubmitError('Please enter a short description before continuing.');
                    return;
                  }
                  setSubmitError(null);
                  setCurrentStep(4);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white text-xs font-bold shadow-xs"
              >
                <span>Review Report</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#87CEEB]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {currentStep === 4 && (
          <div className="card-soft p-6 sm:p-8 border border-[#E2DFD2] bg-white space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#2F4F4F] flex items-center gap-2">
                <span>🔍</span> Step 4: Review and Submit
              </h2>
              <p className="text-xs text-[#586B6B] mt-0.5">
                Verify summary details before submitting to the civic intelligence backend.
              </p>
            </div>

            {submitError && (
              <div className="p-3 bg-[#FBE8E6] border border-[#E9A49A] rounded-xl text-xs text-[#8C3429] flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E2DFD2] space-y-3 text-xs">
              <div className="flex items-start gap-4">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Review"
                    className="w-20 h-20 rounded-xl object-cover border border-[#E2DFD2]"
                  />
                )}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#2F4F4F]">{hazardType}</span>
                    <span className="text-[11px] bg-white border border-[#E2DFD2] text-[#2F4F4F] px-2.5 py-0.5 rounded-full capitalize font-semibold">
                      {observedSeverity} severity
                    </span>
                  </div>
                  <p className="text-[#586B6B]">{address}</p>
                  <p className="font-mono text-[11px] text-[#778899]">
                    {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2DFD2]">
                <span className="font-bold text-[#2F4F4F]">Description:</span>
                <p className="text-[#586B6B] mt-0.5 whitespace-pre-wrap">{description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2DFD2]">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2DFD2] text-[#586B6B] text-xs hover:bg-[#FAF8F2] font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing & Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#87CEEB]" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {currentStep === 5 && createdIncident && (
          <div className="card-soft p-8 border border-[#87CEEB] text-center space-y-6 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#ADD8E6]/40 text-[#2F4F4F] flex items-center justify-center mx-auto text-2xl">
              ✅
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F4F4F]">
                Report Accepted by Backend
              </span>
              <h2 className="text-2xl font-bold text-[#2F4F4F] mt-1">
                Hazard Successfully Recorded
              </h2>
              <p className="text-xs text-[#586B6B] mt-1">
                Incident Reference ID: <span className="font-mono font-bold text-[#2F4F4F]">{createdIncident.id}</span>
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E2DFD2] text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#586B6B]">Initial Status:</span>
                <span className="font-bold text-[#2F4F4F] uppercase">{createdIncident.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#586B6B]">Calculated Risk Score:</span>
                <span className="font-bold text-[#2F4F4F]">{createdIncident.risk_score}/100 ({createdIncident.risk_level})</span>
              </div>
              {createdIncident.ai_analysis && (
                <div className="pt-2 border-t border-[#E2DFD2]">
                  <span className="text-[#586B6B]">AI Visual Interpretation:</span>
                  <p className="text-[#2F4F4F] mt-0.5">{createdIncident.ai_analysis.interpretation}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                to={`/incidents/${createdIncident.id}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2F4F4F] hover:bg-[#233B3B] text-white text-xs font-bold shadow-xs"
              >
                <span>🔍 View Full Incident Page</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#87CEEB]" />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-[#E2DFD2] hover:bg-[#FAF8F2] text-[#2F4F4F] text-xs font-semibold"
              >
                <span>🗺️ View on Live Map</span>
              </Link>
            </div>
          </div>
        )}

      </div>

      {isMapModalOpen && (
        <LocationPickerModal
          initialLat={latitude}
          initialLon={longitude}
          onSelect={(lat, lon, newAddr) => {
            setLatitude(lat);
            setLongitude(lon);
            if (newAddr) setAddress(newAddr);
          }}
          onClose={() => setIsMapModalOpen(false)}
        />
      )}
    </div>
  );
};
