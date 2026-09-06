'use client';

import { useState, type FormEvent } from "react";
import { SaveIcon, UserIcon } from "@/components/icons";
import { ApiError } from "@/lib/api";
import type { CreateConcertInput } from "@/lib/types";

interface ConcertCreateFormProps {
  onCreate: (input: CreateConcertInput) => Promise<void>;
}

const fieldBase =
  "w-full rounded-[6px] border bg-card px-3 py-2.5 text-sm outline-none placeholder:text-placeholder sm:text-base";

const borderTone = (error?: string) => (error ? "border-danger" : "border-border");

const labelClass = "mb-2 block text-sm font-medium text-foreground sm:text-base";

export const ConcertCreateForm = ({ onCreate }: ConcertCreateFormProps) => {
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState("500");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    const seats = Number(totalSeats);
    if (!name.trim()) nextErrors.name = "Concert name is required";
    if (!Number.isInteger(seats) || seats <= 0) {
      nextErrors.totalSeats = "Enter a seat count greater than 0";
    }
    if (!description.trim()) nextErrors.description = "Description is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        totalSeats: seats,
      });
      setName("");
      setTotalSeats("500");
      setDescription("");
    } catch (cause) {
      if (cause instanceof ApiError) {
        setFormError(cause.message);
        setErrors(cause.fieldErrors ?? {});
      } else {
        setFormError("Failed to create concert. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[10px] border border-border bg-card p-5 sm:p-6"
    >
      <h3 className="text-xl font-bold text-primary sm:text-2xl">Create</h3>
      <hr className="my-4 border-border" />

      {formError ? (
        <p className="mb-4 rounded-[6px] bg-danger/10 px-4 py-3 text-sm text-danger">
          {formError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="concert-name" className={labelClass}>
            Concert Name
          </label>
          <input
            id="concert-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Please input concert name"
            className={`${fieldBase} ${borderTone(errors.name)}`}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-danger">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="concert-seats" className={labelClass}>
            Total of seat
          </label>
          <div
            className={`flex items-center gap-2 rounded-[6px] border bg-card px-3 py-2.5 ${borderTone(
              errors.totalSeats,
            )}`}
          >
            <input
              id="concert-seats"
              type="number"
              min={1}
              value={totalSeats}
              onChange={(event) => setTotalSeats(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-placeholder sm:text-base"
            />
            <span className="shrink-0 text-foreground [&_svg]:h-5 [&_svg]:w-5">
              <UserIcon />
            </span>
          </div>
          {errors.totalSeats ? (
            <p className="mt-1 text-xs text-danger">{errors.totalSeats}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="concert-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="concert-description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Please input description"
          className={`${fieldBase} resize-y ${borderTone(errors.description)}`}
        />
        {errors.description ? (
          <p className="mt-1 text-xs text-danger">{errors.description}</p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="flex cursor-pointer items-center gap-2 rounded-[6px] bg-primary-submit px-5 py-2.5 text-sm font-medium text-primary-foreground active:scale-98 disabled:opacity-60 sm:text-base [&_svg]:h-4 [&_svg]:w-4"
        >
          <SaveIcon />
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
};
