import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FolderIcon } from "@heroicons/react/24/outline";
interface ModalCreateFolderProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}
    
export default function ModalCreateFolder({ isOpen, setIsOpen }: ModalCreateFolderProps) {
  

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        {/* Nền mờ */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        {/* Modal panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex flex-col items-center space-y-4">
                
                {/* Icon folder – viền dày hơn */}
                <FolderIcon className="h-12 w-12 stroke-[2.5] text-gray-700" />

                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Name your folder
                </DialogTitle>

                <input
                  type="text"
                  placeholder="Enter folder name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end space-x-3 w-full mt-2">
                  <button
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
