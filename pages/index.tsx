import { useMemo, useState } from "react";
import { trpc } from "@utils/trpc";
import { nanoid } from "nanoid";
import debounce from "lodash/debounce";
import copy from "copy-to-clipboard";
import { useRouter } from "next/router";

const BASE_URL = "https://link.blntrsz.com/";
const DEFAULT_FORM = {
  url: "",
  slug: "",
};
const URL_REGEX = /https?:\/\/[a-zA-Z0-9.-]/;

export default function IndexPage() {
  const createLink = trpc.useMutation(["link.create"]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const { data, isFetched, refetch } = trpc.useQuery([
    "link.is-available",
    {
      slug: form.slug,
    },
  ]);
  const isDisabled = useMemo(() => {
    if (!isFetched) {
      return true;
    }

    return (
      Object.values(form).some((formValue) => !formValue) || !data?.isAvailable
    );
  }, [form, data, isFetched]);

  if (createLink.status === "success") {
    return (
      <div>
        <div>
          <span>{`${BASE_URL}${form.slug}`}</span>
          <button
            className="bg-orange-700 rounded-md p-1 mt-4 ml-2"
            onClick={() => copy(`${BASE_URL}${form.slug}`)}
          >
            Copy Link
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => {
              createLink.reset();
              setForm(DEFAULT_FORM);
            }}
            className="bg-orange-700 rounded-md p-1 mt-4"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {!data?.isAvailable && isFetched && (
          <div className="flex justify-center">
            <span className="text-red-600">Slug is taken!</span>
          </div>
        )}
        {!isValidUrl && form.url && (
          <div className="flex justify-center">
            <span className="text-red-600">Url is not valid!</span>
          </div>
        )}
        <div>
          <span>{BASE_URL}</span>
          <input
            value={form.slug}
            onChange={({ target: { value } }) => {
              setForm((state) => ({ ...state, slug: value }));
              debounce(refetch, 100);
            }}
            className="py-1 px-2 text-zinc-800 rounded-md ml-2 my-2"
            placeholder="slug"
          />
          <button
            onClick={() => {
              setForm((state) => ({ ...state, slug: nanoid() }));
            }}
            className="bg-orange-700 rounded-md p-1 mt-4 ml-2"
          >
            Random
          </button>
        </div>
        <input
          onChange={({ target: { value } }) => {
            setForm((state) => ({ ...state, url: value }));
            setIsValidUrl(URL_REGEX.test(value));
          }}
          placeholder="https://link.blntrsz.com"
          className="w-full py-1 px-2 text-zinc-800 rounded-md my-2"
        />
      </div>
      <button
        disabled={isDisabled}
        className="w-full disabled:bg-orange-300 bg-orange-700 rounded-md p-2 mt-4"
        onClick={() => createLink.mutate({ ...form })}
      >
        Create
      </button>
    </>
  );
}
