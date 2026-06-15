import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserProfile } from '../types';
import { 
  User as UserIcon, 
  MapPin, 
  BookOpen, 
  Linkedin, 
  Twitter, 
  Globe, 
  Briefcase, 
  CheckCircle, 
  Loader2,
  Lock,
  Sparkles
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [bio, setBio] = useState(user?.profile?.bio || 'Fullstack software craftsman passionate about highly performant systems and compiler logic.');
  const [location, setLocation] = useState(user?.profile?.location || 'San Francisco, CA');
  const [linkedin, setLinkedin] = useState(user?.profile?.linkedin || '');
  const [twitter, setTwitter] = useState(user?.profile?.twitter || '');
  const [portfolio, setPortfolio] = useState(user?.profile?.portfolio || '');
  const [skills, setSkills] = useState(user?.profile?.skills.join(', ') || 'React, TypeScript, Node.js, Express, PostgreSQL, Docker');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      await updateProfile({
        bio,
        location,
        linkedin,
        twitter,
        portfolio,
        skills: skillsArray
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
          <UserIcon className="h-7 w-7 text-[#E5E5E7] group-hover:text-emerald-400" />
          <span>Professional Developer Profile</span>
        </h1>
        <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
          Manage your personal biographies, social links anchors, and technical skill matrices to help recruiters formulate alignments indices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Summary Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col items-center text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 font-bold text-white text-xl border-2 border-emerald-500/10 mb-4 select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-sans text-lg font-bold text-white leading-tight">{user.name}</h2>
            <p className="text-xs font-mono text-emerald-400 mt-1">{user.onboarding?.targetRole || 'Developer'}</p>
            <span className="text-[10.5px] font-mono text-[#8E8E93] mt-1.5 flex items-center justify-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </span>

            <p className="text-xs text-[#AEAEB2] leading-relaxed mt-5 italic pl-1 text-center font-sans">
              "{bio}"
            </p>

            {/* Social icons links list */}
            <div className="flex items-center gap-3 mt-6 border-t border-[#1C1C1E] pt-5 w-full justify-center text-[#8E8E93]">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              )}
              {twitter && (
                <a href={twitter} target="_blank" rel="noreferrer" className="hover:text-white transition">
                  <Twitter className="h-4.5 w-4.5" />
                </a>
              )}
              {portfolio && (
                <a href={portfolio} target="_blank" rel="noreferrer" className="hover:text-white transition">
                  <Globe className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs font-mono text-[11px] text-[#8E8E93] space-y-3.5">
            <h3 className="font-sans text-[#E5E5E7] font-semibold text-xs border-b border-[#1C1C1E] pb-2 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>Target Role preferences</span>
            </h3>
            <div className="flex items-center justify-between text-white">
              <span>Experience:</span>
              <span className="font-semibold uppercase text-emerald-400">{user.onboarding?.experienceLevel || 'Beginner'}</span>
            </div>
            <div className="flex items-center justify-between text-white">
              <span>Industry:</span>
              <span className="font-semibold text-emerald-400">{user.onboarding?.preferredIndustry || 'SaaS'}</span>
            </div>
            <div className="flex items-center justify-between text-white">
              <span>Weekly Commits:</span>
              <span className="font-semibold text-emerald-400">{user.onboarding?.weeklyHours || 15} Hours</span>
            </div>
          </div>
        </div>

        {/* Edit fields Column */}
        <div className="lg:col-span-2 rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs">
          <h3 className="font-sans text-white font-bold text-sm border-b border-[#1C1C1E] pb-3 flex items-center gap-2 mb-6">
            <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
            <span>Modify developer parameters</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div>
              <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Short Biographies Summary</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Location Coordinates</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Skills tags (separated by commas)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-3 text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#1C1C1E]">
              <h4 className="text-xs font-bold text-white mb-2">External Portals Anchors</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">LinkedIn Link</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/ada"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Twitter Link</label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/ada"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Portfolio Website</label>
                  <input
                    type="url"
                    placeholder="https://ada.dev"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#1C1C1E] pt-5">
              {success ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="h-4.5 w-4.5" />
                  <span>Profile variables updated successfully!</span>
                </span>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Variables...</span>
                  </>
                ) : (
                  <span>Persist Profile Variables</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
