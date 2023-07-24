import {useState} from 'react';

export function CustomModal({
  title,
  svg,
  cancelLink,
  children,
  className = 'border px-2 text-[#6C4A6F] flex gap-2 items-center',
}) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <div className="">
        <button className={className} onClick={openModal}>
          <span>{svg && svg}</span>
          <span
            className="text-base tracking-wide"
            style={{
              fontFamily: 'Poppins-400',
            }}
          >
            {title}
          </span>
        </button>
      </div>
      <div
        className={`fixed z-10 overflow-y-auto top-0 w-full left-0 ${
          !showModal && 'hidden'
        }`}
        id="modal"
      >
        <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-900 opacity-75" />
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203;
          </span>
          <div
            className="inline-block align-center bg-white text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="relative">
              <div className="p-4">{children}</div>
              <div className="absolute -top-4 -right-4">
                <button
                  type="button"
                  className="p-2 z-50 bg-[#6C4A6F] text-white"
                  onClick={closeModal}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.78645 0L0 1.78645L9.21355 11L0 20.2135L1.78645 22L11 12.7865L20.2135 22L22 20.2135L12.7865 11L22 1.78645L20.2135 0L11 9.21355L1.78645 0Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
