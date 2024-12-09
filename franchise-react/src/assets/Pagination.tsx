export const GoToFirstPage = ({ disabled }: { disabled: boolean }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.2074 3.6811L11.2074 3.68116L11.2135 3.6749C11.2288 3.65899 11.2472 3.64629 11.2676 3.63755C11.2879 3.62882 11.3098 3.62422 11.3319 3.62403C11.354 3.62384 11.376 3.62805 11.3964 3.63643C11.4169 3.64482 11.4355 3.65719 11.4512 3.67284C11.4668 3.68849 11.4792 3.7071 11.4876 3.72758C11.496 3.74806 11.5002 3.77001 11.5 3.79214C11.4998 3.81427 11.4952 3.83614 11.4865 3.85647C11.4777 3.87681 11.465 3.8952 11.4491 3.91057L11.4491 3.91052L11.4429 3.91666L8.14292 7.21666L7.78937 7.57021L8.14292 7.92377L11.4388 11.2197C11.4679 11.2509 11.484 11.2921 11.4836 11.3348C11.4832 11.3785 11.4657 11.4203 11.4348 11.4512C11.4039 11.4821 11.3621 11.4996 11.3184 11.5C11.2757 11.5004 11.2345 11.4843 11.2033 11.4552L7.43608 7.68805C7.40484 7.65679 7.38728 7.61441 7.38728 7.57021C7.38728 7.52605 7.40482 7.48369 7.43603 7.45244C7.43605 7.45242 7.43606 7.4524 7.43608 7.45238L11.2074 3.6811Z"
        fill="#1F499E"
        stroke={disabled ? "#647082" : "#1F499E"}
      />
      <path d="M4 12L4 3" stroke={disabled ? "#647082" : "#1F499E"} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};

export const GoToPrevPage = ({ disabled }: { disabled: boolean }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.62084 8.58519C5.4945 8.46154 5.42244 8.29278 5.42051 8.11601C5.41858 7.93925 5.48694 7.76895 5.61055 7.64258L9.34047 3.83029C9.40127 3.76595 9.47428 3.71436 9.55523 3.67853C9.63618 3.64271 9.72345 3.62336 9.81196 3.62163C9.90046 3.61989 9.98843 3.6358 10.0707 3.66842C10.153 3.70105 10.228 3.74973 10.2913 3.81164C10.3545 3.87355 10.4048 3.94744 10.4393 4.029C10.4737 4.11056 10.4915 4.19815 10.4917 4.28668C10.4919 4.3752 10.4745 4.46288 10.4404 4.54459C10.4064 4.6263 10.3564 4.70041 10.2934 4.7626L7.02961 8.09844L10.3654 11.3622C10.4882 11.4866 10.5573 11.6543 10.5577 11.8291C10.5581 12.0039 10.4898 12.1718 10.3675 12.2968C10.2453 12.4217 10.0788 12.4937 9.90408 12.4971C9.72931 12.5005 9.56018 12.4352 9.43313 12.3151L5.62084 8.58519Z"
        fill={disabled ? "#647082" : "#1F499E"}
      />
    </svg>
  );
};

export const GoToNextPage = ({ disabled }: { disabled: boolean }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5583 7.61568C10.6833 7.7407 10.7535 7.91024 10.7535 8.08701C10.7535 8.26379 10.6833 8.43333 10.5583 8.55834L6.78694 12.3297C6.72544 12.3934 6.65188 12.4441 6.57054 12.4791C6.48921 12.514 6.40173 12.5324 6.31321 12.5332C6.22469 12.5339 6.1369 12.5171 6.05497 12.4836C5.97304 12.45 5.8986 12.4005 5.83601 12.3379C5.77341 12.2753 5.72391 12.2009 5.69039 12.119C5.65687 12.037 5.64 11.9493 5.64077 11.8607C5.64154 11.7722 5.65993 11.6847 5.69487 11.6034C5.72981 11.5221 5.7806 11.4485 5.84427 11.387L9.14427 8.08701L5.84427 4.78701C5.72283 4.66128 5.65564 4.49288 5.65716 4.31808C5.65868 4.14328 5.72879 3.97607 5.85239 3.85247C5.976 3.72886 6.14321 3.65875 6.31801 3.65723C6.4928 3.65571 6.6612 3.72291 6.78694 3.84434L10.5583 7.61568Z"
        fill={disabled ? "#647082" : "#1F499E"}
      />
    </svg>
  );
};
export const GoToLastPage = ({ disabled }: { disabled: boolean }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.79264 12.3189L4.79259 12.3188L4.78655 12.3251C4.77117 12.341 4.75278 12.3537 4.73245 12.3624C4.71212 12.3712 4.69024 12.3758 4.66812 12.376C4.64599 12.3762 4.62404 12.3719 4.60356 12.3636C4.58307 12.3552 4.56446 12.3428 4.54882 12.3272C4.53317 12.3115 4.52079 12.2929 4.51241 12.2724C4.50403 12.2519 4.49981 12.23 4.50001 12.2079C4.5002 12.1857 4.5048 12.1639 4.51353 12.1435C4.52227 12.1232 4.53496 12.1048 4.55088 12.0894L4.55093 12.0895L4.55708 12.0833L7.85708 8.78334L8.21063 8.42979L7.85708 8.07623L4.56118 4.78033C4.53208 4.74914 4.51602 4.70793 4.51639 4.6652C4.51677 4.6215 4.5343 4.57969 4.5652 4.54879C4.5961 4.51789 4.63791 4.50036 4.6816 4.49998C4.72434 4.49961 4.76554 4.51567 4.79673 4.54476L8.56392 8.31195C8.59516 8.34321 8.61272 8.38559 8.61272 8.42979C8.61272 8.47395 8.59518 8.51632 8.56397 8.54757C8.56395 8.54758 8.56394 8.5476 8.56392 8.54762L4.79264 12.3189Z"
        fill="#1F499E"
        stroke={disabled ? "#647082" : "#1F499E"}
      />
      <path d="M12 4L12 13" stroke={disabled ? "#647082" : "#1F499E"} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};
