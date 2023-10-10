import React, { useState, FormEvent } from "react";
import axios from "axios";
import LoadingSquare from "./LoadingSquare";

interface TruecallerResponse {
  id: string;
  name: string;
  phones: { e164Format: string; numberType: string; carrier: string }[];
  addresses: { city: string; countryCode: string; timeZone: string }[];
}

interface SearchResponse {
  data: {
    status_code: number;
    data: {
      data: TruecallerResponse[];
    };
  };
}

const isValidIndianPhoneNumber = (number: string) => {
  const regex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  return regex.test(number);
};

const TruecallerSearchComponent: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [result, setResult] = useState<TruecallerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const performTruecallerSearch = async (event: FormEvent) => {
    event.preventDefault();

    setError(null);
    setResult(null);
    if (!isValidIndianPhoneNumber(phoneNumber)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get<SearchResponse>(
        `https://truecallerwebcloudrun-ly4n4stmka-ew.a.run.app/search?phone_number=${phoneNumber}`
      );
      if (response.data.data.data.data.length > 0) {
        setLoading(false);
        setResult(response.data.data.data.data[0]);
      } else {
        setLoading(false);
        setError("No results found.");
      }
    } catch (err) {
      setLoading(false);
      setError("Error occurred.");
    }
  };

  return (
    <div className="p-4 mt-24 md:mt-32 lg:mt-64 max-w-md mx-auto">
      {loading && <LoadingSquare />}
      <form onSubmit={performTruecallerSearch} className="mb-4">
        <div className="flex flex-col justify-center items-center gap-x-2 sm:flex-row">
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-grow p-2 mb-2 sm:mb-0 border border-gray-300 rounded-md focus:outline-none  focus:border-blue-400 sm:rounded-md w-full sm:w-auto"
          />
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  sm:rounded-md w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 bg-red-100 px-4 py-10 rounded mb-4 border border-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl mb-2 font-semibold border-b pb-2">
            {result.name}
          </h2>
          <p className="mb-2 mt-2">
            <strong>Phone:</strong> {result.phones[0]?.e164Format}
          </p>
          <p className="mb-2">
            <strong>Type:</strong> {result.phones[0]?.numberType}
          </p>
          <p className="mb-2">
            <strong>Carrier:</strong> {result.phones[0]?.carrier}
          </p>
          <p className="mb-2">
            <strong>Location:</strong> {result.addresses[0]?.city},{" "}
            {result.addresses[0]?.countryCode} ({result.addresses[0]?.timeZone})
          </p>
        </div>
      )}
    </div>
  );
};

export default TruecallerSearchComponent;
