import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const pad = (n) => (n < 10 ? "0" + n : n);

export default function App() {
  const now = new Date();
  const initialDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const initialTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [form, setForm] = useState({
    responded_by: "",
    call_date: initialDate,
    call_time: initialTime,
    caller_name: "",
    caller_phone: "",
    company_name: "",
    problem_description: "",
    remarks: "",
    solved: false,
  });

  const [status, setStatus] = useState("");
  const firstInputRef = useRef(null);

  const categories = [
    {
      name: "spotlight",
      label: "Spotlight",
      subs: [
        { name: "spotlight_app", label: "Εφαρμογή" },
        { name: "spotlight_network", label: "Δίκτυο" },
      ],
    },
    {
      name: "pda",
      label: "PDA",
      subs: [
        { name: "pda_connection", label: "Σύνδεση" },
        { name: "pda_orders", label: "Παραγγελίες" },
      ],
    },
    {
      name: "printer",
      label: "Θερμικός Εκτυπωτής",
      subs: [
        { name: "printer_connection", label: "Σύνδεση" },
        { name: "printer_printing", label: "Εκτύπωση" },
      ],
    },
    {
      name: "pos",
      label: "POS",
      subs: [
        { name: "pos_connection", label: "Σύνδεση" },
        { name: "pos_payments", label: "Πληρωμές" },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Αποστολή...");

    const { error } = await supabase.from("calls").insert([form]);

    if (error) setStatus("Σφάλμα κατά την αποθήκευση.");
    else setStatus("Η καταγραφή αποθηκεύτηκε επιτυχώς!");
  };

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  const LabeledField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    isTextarea,
    placeholder,
    ref,
  }) => (
    <div>
      {label && (
        <label className="block text-blue-900 font-medium mb-1">{label}</label>
      )}
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          ref={ref}
          className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none text-blue-900"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
          className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none text-blue-900"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-6xl space-y-6"
      >
        <h1 className="text-2xl font-bold text-blue-900 text-center mb-6">
          Καταγραφή Προβλήματος
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 🟦 Φόρμα */}
          <div className=" border border-blue-200 rounded-2xl shadow-md p-6 space-y-6">
            <h2 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Στοιχεία Κλήσης
            </h2>

            <LabeledField
              label="Χειριστής"
              name="responded_by"
              value={form.responded_by}
              onChange={handleChange}
              ref={firstInputRef}
            />

            <div className="flex flex-col md:flex-row gap-6">
              <LabeledField
                label="Ημερομηνία"
                type="date"
                name="call_date"
                value={form.call_date}
                onChange={handleChange}
              />
              <LabeledField
                label="Ώρα"
                type="time"
                name="call_time"
                value={form.call_time}
                onChange={handleChange}
              />
            </div>

            <LabeledField
              label="Ποιός κάλεσε"
              name="caller_name"
              value={form.caller_name}
              onChange={handleChange}
            />

            <LabeledField
              label="Τηλέφωνο"
              name="caller_phone"
              value={form.caller_phone}
              onChange={handleChange}
            />

            <LabeledField
              label="Κατάστημα"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
            />

            <LabeledField
              label="Περιγραφή Προβλήματος"
              name="problem_description"
              value={form.problem_description}
              onChange={handleChange}
              isTextarea
            />

            <LabeledField
              label="Παρατηρήσεις"
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              isTextarea
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="solved"
                checked={form.solved}
                onChange={handleChange}
                className="appearance-none w-5 h-5 rounded border border-blue-400 checked:bg-green-700 checked:border-green-700 transition-all"
              />
              <span className="font-medium text-blue-900">Επιλύθηκε</span>
            </div>
          </div>

          {/* 🟦 Κατηγορίες */}
          <div className="border border-blue-200 rounded-2xl shadow-md p-6 space-y-6">
            <h2 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Κατηγορίες
            </h2>

            {categories.map((cat) => (
              <div
                key={cat.name}
                className={`border rounded-xl p-4 border-blue-300 transition-all ${
                  form[cat.name]
                    ? "shadow-md bg-white border-blue-400"
                    : "bg-blue-50"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name={cat.name}
                    checked={form[cat.name]}
                    onChange={handleChange}
                    className="appearance-none w-5 h-5 rounded border border-blue-400 checked:bg-blue-800 checked:border-blue-800 transition-all"
                  />
                  <span className="font-medium text-blue-900">{cat.label}</span>
                </label>

                <AnimatePresence>
                  {form[cat.name] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 space-y-3"
                    >
                      {cat.subs.map((sub) => (
                        <div key={sub.name} className="ml-6 pl-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name={sub.name}
                              checked={form[sub.name] || false}
                              onChange={handleChange}
                              className="appearance-none w-4 h-4 rounded border border-blue-300 checked:bg-blue-900 checked:border-blue-900 transition-all"
                            />
                            <span className="font-medium text-blue-900">
                              {sub.label}
                            </span>
                          </label>

                          <AnimatePresence>
                            {form[sub.name] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <LabeledField
                                  name={`${sub.name}_comments`}
                                  value={form[`${sub.name}_comments`] || ""}
                                  onChange={handleChange}
                                  placeholder="Προσθέστε σχόλια..."
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "Αποστολή..."}
          className={`bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg w-full transition-colors ${
            status === "Αποστολή..." ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Αποθήκευση
        </button>

        {status && <p className="text-center text-blue-900">{status}</p>}
      </form>
    </div>
  );
}
