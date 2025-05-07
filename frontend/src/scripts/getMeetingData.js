// Dummy function to simulate fetching meeting data
export function getMeetingData(Id, isCreator) {

    // TODO: remember no to give the non-creator the creatorID (do not even put it to this script)
    // TODO: fetch the meeting data from the server using the Id and isCreator

    return [
        {
            creatorId: 1,
            participantId: 2,
            title: "Sample Meeting Title",
            start: "2023-10-01T10:00:00Z",
            end: "2023-10-01T11:00:00Z",
            description: "This is a sample meeting description.",
            location: "Virtual Meeting Room",
            duration: 60,
            showParticipants: true,
            allowEmail: false,
        }
    ];
}