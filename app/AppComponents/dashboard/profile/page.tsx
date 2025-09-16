"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    avatar_url: "",
  });

  // 🔹 Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        const { data } = await supabase
          .from("profiles")
          .select("full_name, dob, avatar_url")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile({
            name: data.full_name || "",
            dob: data.dob ? data.dob.split("T")[0] : "",
            avatar_url: data.avatar_url || "",
          });
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  // 🔹 Update profile
  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert(
      [
        {
          id: user.id,
          full_name: profile.name,
          dob: profile.dob || null,
          avatar_url: profile.avatar_url || null,
        },
      ],
      { onConflict: "id" }
    );

    if (error) {
      console.error("Update error:", JSON.stringify(error, null, 2));
      alert("Error updating profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
    }
  };

  // 🔹 Upload avatar
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !user) return;

    const file = event.target.files[0];
    const filePath = `${user.id}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      alert("Failed to upload avatar");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setProfile({ ...profile, avatar_url: data.publicUrl });
  };

  // 🔹 Remove avatar
  const handleRemoveAvatar = async () => {
    if (!user) return;

    if (profile.avatar_url) {
      const filePath = profile.avatar_url.split("/avatars/")[1];
      if (filePath) {
        await supabase.storage.from("avatars").remove([filePath]);
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);

    if (error) {
      console.error("Remove avatar error:", error);
      alert("Failed to remove avatar");
    } else {
      setProfile({ ...profile, avatar_url: "" });
      alert("Avatar removed successfully!");
    }
  };

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading profile…
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
       <h1
    className="text-4xl font-extrabold text-center
               bg-gradient-to-r from-blue-500 via-purple-500 to-red-500
               bg-[length:200%_200%] animate-gradient-text
               text-transparent bg-clip-text
               "
  >
    Profile
  </h1>

      {/* Avatar Upload */}
      <div className="flex items-center space-x-6 p-6 bg-white/50 dark:bg-gray-900/70 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200 dark:border-gray-700">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt="Avatar"
            width={90}
            height={90}
            className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-inner"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium shadow-inner">
            No Image
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="text-sm text-gray-700 dark:text-gray-300 file:py-2 file:px-4 file:rounded-full file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
          />
          {profile.avatar_url && (
            <Button variant="destructive" size="sm" className="rounded-full" onClick={handleRemoveAvatar}>
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <Label className="text-gray-700 dark:text-gray-300 font-semibold">Full Name</Label>
          <Input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label className="text-gray-700 dark:text-gray-300 font-semibold">Email</Label>
          <Input
            value={user?.email}
            disabled
            className="rounded-xl bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 cursor-not-allowed shadow-sm"
          />
        </div>

        {/* DOB */}
        <div className="space-y-1">
          <Label className="text-gray-700 dark:text-gray-300 font-semibold">Date of Birth</Label>
          <Input
            type="date"
            value={profile.dob}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className="w-full py-3 text-lg rounded-2xl text-white
                   bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                   bg-[length:200%_200%] animate-gradient-text
                   shadow-xl hover:scale-105 transition-all duration-300"
      >
        Save Changes
      </Button>
    </div>
  );
}
