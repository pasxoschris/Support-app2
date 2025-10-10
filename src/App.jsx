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

  const firstInputRef = useRef(null);

  const getInitialForm = () => ({
    call_date: initialDate,
    call_time: initialTime,
    caller_name: "",
    caller_phone: "",
    company_name: "",
    problem_description: "",
    solved: false,
    remarks: "",
    responded_by: "",
    // Κύριες κατηγορίες
    spotlight_related: false,
    pda_related: false,
    printer_related: false,
    pos_related: false,
    // Υποκατηγορίες
    spotlight_sub1: false,
    spotlight_sub1_comments: "",
    spotlight_sub2: false,
    spotlight_sub2_comments: "",
    spotlight_sub3: false,
    spotlight_sub3_comments: "",
    pda_sub1: false,
    pda_sub1_comments: "",
    pda_sub2: false,
    pda_sub2_comments: "",
    pda_sub3: false,
    pda_sub3_comments: "",
    printer_sub1: false,
    printer_sub1_comments: "",
    printer_sub2: false,
    printer_sub2_comments: "",
    printer_sub3: false,
    printer_sub3_comments: "",
    pos_sub1: false,
    pos_sub1_comments: "",
    pos_sub2: false,
    pos_sub2_comments: "",
    pos_sub3: false,
    pos_sub3_comments: "",
  });

  const [form, setForm] = useState(getInitialForm());
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  const categories = [
    {
      label: "Spotlight",
      name: "spotlight_related",
      subs: [
        { name: "spotlight_sub1", label: "Spotlight Υποκατηγορία 1" },
        { name: "spotlight_sub2", label: "Spotlight Υποκατηγορία 2" },
        { name: "spotlight_sub3", label: "Spotlight Υποκατηγορία 3" },
      ],
    },
    {
      label: "PDA",
      name: "pda_related",
      subs: [
        { name: "pda_sub1", label: "PDA Υποκατηγορία 1" },
        { name: "pda_sub2", label: "PDA Υποκατηγορία 2" },
        { name: "pda_sub3", label: "PDA Υποκατηγορία 3" },
      ],
    },
    {
      label: "Εκτυπωτή",
      name: "printer_related",
      subs: [
        { name: "printer_sub1", label: "Εκτυπωτή Υποκατηγορία 1" },
        { name: "printer_sub2", label: "Εκτυπωτή Υποκατηγορία 2" },
        { name: "printer_sub3", label: "Εκτυπωτή Υποκατηγορία 3" },
      ],
    },
    {
      label: "POS",
      name: "pos_related",
      subs: [
        { name: "pos_sub1", label: "POS Υποκατηγορία 1" },
        { name: "pos_sub2", label: "POS Υποκατηγορία 2" },
        { name: "pos_sub3", label: "POS Υποκατηγορία 3" },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Αποστολή...");

    const { error } = await supabase.from("support_logs").insert([form]);

    if (error) {
      console.error(error);
      setStatus("❌ Σφάλμα: " + error.message);
    } else {
      setStatus("✅ Αποθηκεύτηκε!");
      setForm(getInitialForm());
      firstInputRef.current.focus();
    }
  };

  const LabeledField = React.forwardRef(
    ({ label, name, value, onChange, type = "text", isTextarea = false, placeholder }, ref) => (
      <div className="w-full">
        {label && <label className="block text-blue-900 font-medium mb-1">{label}</label>}
        {isTextarea ? (
          <textarea
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className="block w-full rounded-lg border border-blue-400 p-3 text-blue-900 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 transition-all"
          />
        ) : (
          <input
            ref={ref}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="block w-full rounded-lg border border-blue-400 p-3 text-blue-900 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 transition-all"
          />
        )}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-6"
      >
        <h1 className="text-2xl font-bold text-blue-900 text-center mb-6">
          Καταγραφή Προβλήματος
        </h1>

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

        <div className="space-y-6">
            <h2 className="text-lg  text-blue-900 border-b pb-1 mb-2">Κατηγορίες</h2>

          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`border rounded-xl p-4 border-blue-400 transition-all ${
                form[cat.name] ? "shadow-md bg-blue-50 border-blue-400" : "bg-white"
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
                      
                      <div key={sub.name} className="ml-6 pl-4 ">
                      
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name={sub.name}
                            checked={form[sub.name] || false}
                            onChange={handleChange}
                            className="appearance-none w-4 h-4 rounded border border-blue-300 checked:bg-blue-900 checked:border-blue-900 transition-all"
                          />
                          <span className="font-medium text-blue-900">{sub.label}</span>
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
