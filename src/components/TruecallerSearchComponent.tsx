import React, { useState } from "react";
import truecallerjs, { SearchData, Format } from "truecallerjs";

interface Data {
  message: string;
  name: string;
  code: number;
}

interface axiosErrorInterface {
  data: Data;
}

const TruecallerSearchComponent: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [result, setResult] = useState<Format | null | axiosErrorInterface>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const performTruecallerSearch = async () => {
    const searchData: SearchData = {
      number: phoneNumber,
      countryCode: "IN",
      installationId:
        "a1i07--iRQh3akgVg3cHwR9ag4sZocWciCya5efCv0weepyR7HybtSL2j6zvGFzc",
    };

    try {
      const response: Format = await truecallerjs.search(searchData);
      setResult(response);
    } catch (err) {
      setError((err as Error).message || "Error occurred.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={performTruecallerSearch}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {error && <div className="bg-red-200 p-4 rounded mb-4">{error}</div>}
      {result &&
        "data" in result &&
        result.data.message !== "Network Error" && (
          <div className="bg-red-200 p-4 rounded mb-4">Network Error</div>
        )}

      {result && !("data" in result) && (
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl mb-2">{(result as Format).getName()}</h2>
          <p className="mb-2">Alternate Name: {result.getAlternateName()}</p>
          <p className="mb-2">Email: {result.getEmailId()}</p>
        </div>
      )}
    </div>
  );
};

export default TruecallerSearchComponent;
