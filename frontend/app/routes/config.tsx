import type { Route } from "./+types/config";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Config - Travel Map Tracker" },
    { name: "description", content: "Configuration page for Travel Map Tracker" },
  ];
}

export default function Config() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Configuration
        </h1>
        <p className="text-gray-600 text-center">
          This is a blank configuration page. Add your settings here.
        </p>
      </div>
    </div>
  );
}
